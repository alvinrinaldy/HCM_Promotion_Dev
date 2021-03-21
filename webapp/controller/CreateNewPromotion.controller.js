sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./Dialog1",
	"./utilities",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast",
	'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator'
], function (BaseController, MessageBox, Dialog1, Utilities, History,MessageToast, Filter, FilterOperator) {
	"use strict";

	return BaseController.extend("com.sap.build.standard.modulePa.controller.CreateNewPromotion", {
		handleRouteMatched: function (oEvent) {
			var sAppId = "App60336b1fade8e57e74bdb140";

			var oParams = {};

			// if (oEvent.mParameters.data.context) {
			// 	this.sContext = oEvent.mParameters.data.context;

			// } else {
			// 	if (this.getOwnerComponent().getComponentData()) {
			// 		var patternConvert = function (oParam) {
			// 			if (Object.keys(oParam).length !== 0) {
			// 				for (var prop in oParam) {
			// 					if (prop !== "sourcePrototype" && prop.includes("Set")) {
			// 						return prop + "(" + oParam[prop][0] + ")";
			// 					}
			// 				}
			// 			}
			// 		};

			// 		this.sContext = patternConvert(this.getOwnerComponent().getComponentData().startupParameters);

			// 	}
			// }

			var oPath;

			if (this.sContext) {
				oPath = {
					path: "/" + this.sContext,
					parameters: oParams
				};
				this.getView().bindObject(oPath);
			}

		},
		_onInputValueHelpRequest: function (oEvent) {

			var sDialogName = "Dialog1";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new Dialog1(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}

			var context = oEvent.getSource().getBindingContext();
			oDialog._oControl.setBindingContext(context);

			oDialog.open();

		},
		_onButtonPress: function (oEvent) {

			var oBindingContext = oEvent.getSource().getBindingContext();

			return new Promise(function (fnResolve) {

				this.doNavigate("ListDataPromotion", oBindingContext, fnResolve, "");
			}.bind(this)).catch(function (err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},
		doNavigate: function (sRouteName, oBindingContext, fnPromiseResolve, sViaRelation) {
			var sPath = (oBindingContext) ? oBindingContext.getPath() : null;
			var oModel = (oBindingContext) ? oBindingContext.getModel() : null;

			var sEntityNameSet;
			if (sPath !== null && sPath !== "") {
				if (sPath.substring(0, 1) === "/") {
					sPath = sPath.substring(1);
				}
				sEntityNameSet = sPath.split("(")[0];
			}
			var sNavigationPropertyName;
			var sMasterContext = this.sMasterContext ? this.sMasterContext : sPath;

			if (sEntityNameSet !== null) {
				sNavigationPropertyName = sViaRelation || this.getOwnerComponent().getNavigationPropertyForNavigationWithContext(sEntityNameSet,
					sRouteName);
			}
			if (sNavigationPropertyName !== null && sNavigationPropertyName !== undefined) {
				if (sNavigationPropertyName === "") {
					this.oRouter.navTo(sRouteName, {
						context: sPath,
						masterContext: sMasterContext
					}, false);
				} else {
					oModel.createBindingContext(sNavigationPropertyName, oBindingContext, null, function (bindingContext) {
						if (bindingContext) {
							sPath = bindingContext.getPath();
							if (sPath.substring(0, 1) === "/") {
								sPath = sPath.substring(1);
							}
						} else {
							sPath = "undefined";
						}

						// If the navigation is a 1-n, sPath would be "undefined" as this is not supported in Build
						if (sPath === "undefined") {
							this.oRouter.navTo(sRouteName);
						} else {
							this.oRouter.navTo(sRouteName, {
								context: sPath,
								masterContext: sMasterContext
							}, false);
						}
					}.bind(this));
				}
			} else {
				this.oRouter.navTo(sRouteName);
			}

			if (typeof fnPromiseResolve === "function") {
				fnPromiseResolve();
			}

		},
		_onButtonPress1: function (oEvent) {

			var oBindingContext = oEvent.getSource().getBindingContext();

			return new Promise(function (fnResolve) {

				this.doNavigate("SelectEmployeePromotion", oBindingContext, fnResolve, "");
			}.bind(this)).catch(function (err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},
		_onObjectMatched: function (oEvent) {
			
			//get odata entity select employee by employeeID
			this.getView().bindElement({
				path: decodeURIComponent("/SelectEmployeeSet('" + oEvent.getParameter("arguments").EmployeeId+"')"),
				model: "Employee"
			});
			
			
			var employeeid = oEvent.getParameter("arguments").EmployeeId;
			// var res = str.replace(/%20/g, " ");
			var employeename = decodeURIComponent(oEvent.getParameter("arguments").EmployeeName);
			// employeename = res;
			MessageToast.show(employeeid + " - " + employeename);
			
			this.getView().byId("EmployeeId").setValue(employeeid);
			this.getView().byId("EmployeeName").setValue(employeename);
			
			//define odata
			this.sUrl = "/sap/opu/odata/sap/ZHCM_PROMOSI_SRV/";
			this.oModelData = new sap.ui.model.odata.ODataModel(this.sUrl, true);
			
			//Define Model LastEducation
			var oModelEdu = this.getOwnerComponent().getModel("CreateNewPromotion"),
			oViewModelEducation = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oModelEdu);
			this.getView().setModel(oViewModelEducation, "LastEducation");
			//read education data 
			this.oModelData.read("/LastEducationSet('"+employeeid+"')", {
			  success: function(oData, response) { 
			  	 oViewModelEducation.setData(oData);
			  },
			  error: function(oError) { 
			  }
			});
			
			//Define Model Current Organization by Employee ID
			var oModelOrg = this.getOwnerComponent().getModel("CreateNewPromotion"),
			oViewModelOrganization = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oModelOrg);
			this.getView().setModel(oViewModelOrganization, "CurrentOrganization");
			//read Organization Data 
			this.oModelData.read("/LISTREQUESTDATAPROMOTIONSet(Reqid='',Pernr='"+employeeid+"')", {
			  success: function(oData, response) { 
			  	 oViewModelOrganization.setData(oData);
			  	 //console.log("success");
			  	 // done
			  },
			  error: function(oError) { 
			  	// console.log("error");
			  }
			});
			
			//Define Model Length of Service by Employee ID
			var oModelLos = this.getOwnerComponent().getModel("CreateNewPromotion"),
			oViewModelServiceLength = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oModelLos);
			this.getView().setModel(oViewModelServiceLength, "ServiceLength");
			//read Length of Service Data
			this.oModelData.read("/LengthOfServiceSet(Pernr='"+employeeid+"')", {
				success: function(oData, respionse) {
					oViewModelServiceLength.setData(oData);
					// console.log("success");
					// done
				},
				error: function(oError) {
					// console.log("error");
				}
			});
			
			//Define Model Performance Appraisal by Employee ID
			var oModelPa = this.getOwnerComponent().getModel("CreateNewPromotion"),
			oViewModelPerformanceAppraisal = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oModelPa);
			this.getView().setModel(oViewModelPerformanceAppraisal, "PerformanceAppraisal");
			//read Length of Service Data
			this.oModelData.read("/PerformanceAppraisalsSet('"+employeeid+"')", {
				success: function(oData, respionse) {
					oViewModelPerformanceAppraisal.setData(oData);
					console.log("success");
					// done
				},
				error: function(oError) {
					console.log("error");
				}
			});
			
			// //Defind Model Performance Appraisal by Employee ID
			// var oModelPa = this.getOwnerComponent().getModel("CreateNewPromotion"),
			// oViewModelPerformanceAppraisal = new sap.ui.model.json.JSONModel();
			// this.getView().setModel(oModelPa);
			// this.getView().setModel(oViewModelPerformanceAppraisal, "PerformanceAppraisal");
			// this.sUrl = "/sap/opu/odata/sap/ZHCM_PROMOSI_SRV/";
			// this.oModelData = new sap.ui.model.odata.ODataModel(this.sUrl, true);
			// //read Performance Appraisal Data
			// this.oModelData.read("/PerformanceAppraisalsSet(Pernr='"+employeeid+"')", {
			// 	success: function(oData, respionse) {
			// 		oViewModelPerformanceAppraisal.setData(oData);
			// 		console.log(respionse);
			// 	},
			// 	error: function(oError) {
			// 		console.log("error nya ini");
			// 		// Need to check on OData
			// 	}
			// });
			
			//Defind Model Warning Letter by Employee ID
			var oModelWarning = this.getOwnerComponent().getModel("CreateNewPromotion"),
			oViewModelWarningLetter = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oModelWarning);
			this.getView().setModel(oViewModelWarningLetter, "WarningLetter");
			//read Length of Service Data
			this.oModelData.read("/WarningLetterSet(Pernr='"+employeeid+"')", {
				success: function(oData, respionse) {
					oViewModelWarningLetter.setData(oData);
					// console.log("success");
					// done
				},
				error: function(oError) {
					// console.log("error");
				}
			});
			
			// var accEbeln = this.getView().byId("Ebeln").getValue();
			// //var accEbelp = this.getView().byId("Ebelp").getValue();
			// var oFilter = new sap.ui.model.Filter("Ebeln", sap.ui.model.FilterOperator.EQ, accEbeln);
			// this.getView().byId("listItems").getBinding("items").filter(oFilter);

		},
		
		onInit: function () {
			// this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			// this.oRouter.getTarget("CreateNewPromotion").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
			
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("CreateNewPromotion").attachPatternMatched(this._onObjectMatched, this);
			
			
			var sUrl = "/sap/opu/odata/sap/ZHCM_PROMOSI_SRV/";
			var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
			// oModel.setDefaultCountMode(sap.ui.model.odata.CountMode.inline);
			this.getView().setModel(oModel,"odataPromosi");
			
			
		},
		
		handleValueHelpSelectGolongan : function (oController) {
			if (!this._valueHelpDialogGolongan) {
				this._valueHelpDialogGolongan = sap.ui.xmlfragment(
					"com.sap.build.standard.modulePa.view.ValueHelpDialog.ValueHelpSelectGolongan",
					this
				);
				this.getView().addDependent(this._valueHelpDialogGolongan);
			}

			// open value help dialog
			this._valueHelpDialogGolongan.open();
		},
		
		handleValueHelpGolonganClose : function (evt) {
			var oSelectedContexts = evt.getParameter("selectedContexts");
			var sPath = oSelectedContexts[0].sPath;
			var oIdGolongan = this.getView().byId("idGolongan");
			oIdGolongan.setValue(this.getView().getModel("odataPromosi").getProperty(sPath).Persk+ " - " +this.getView().getModel("odataPromosi").getProperty(sPath).Ptext);
		},
		
		handleValueHelpGolonganSearch : function (evt) {
			
			var oSelectedContexts = evt.getParameter("selectedContexts");
			// var sPath = oSelectedContexts[0].sPath;
			var oIdGolongan = this.getView().byId("idGolongan");
			
			var sValue = evt.getParameter("value").toUpperCase();
			var aFilter = [];
			if(sValue !== ""){
				var sValueLower = sValue.toLowerCase();
				var sValueUpper = sValue.toUpperCase();
				var sValueUpLow = sValue[0].toUpperCase() + sValue.substr(1).toLowerCase();
				aFilter.push(new Filter("Ptext", FilterOperator.Contains, sValueLower));
				aFilter.push(new Filter("Ptext", FilterOperator.Contains, sValueUpper));
				aFilter.push(new Filter("Ptext", FilterOperator.Contains, sValueUpLow));
				aFilter.push(new Filter("Ptext", FilterOperator.Contains, sValue));
			}else{
				aFilter.push(new Filter("Ptext", FilterOperator.Contains, sValue));
			}
		
			evt.getSource().getBinding("items").filter(aFilter);
		},
		
		handleValueHelpSelectPosition : function (oController) {
			if (!this._valueHelpDialogPosition) {
				this._valueHelpDialogPosition = sap.ui.xmlfragment(
					"com.sap.build.standard.modulePa.view.ValueHelpDialog.ValueHelpSelectPosition",
					this
				);
				this.getView().addDependent(this._valueHelpDialogPosition);
			}

			// open value help dialog
			this._valueHelpDialogPosition.open();
		},
		
		handleValueHelpPositionClose : function (evt) {
			var oSelectedContexts = evt.getParameter("selectedContexts");
			var sPath = oSelectedContexts[0].sPath;
			var oIdPosition = this.getView().byId("idPosition");
			var oIdDivision = this.getView().byId("DivisionA");
			var oIdDepartment = this.getView().byId("DepartmentA");
			var oIdSection = this.getView().byId("SectionA");
			
			oIdPosition.setValue(this.getView().getModel("odataPromosi").getProperty(sPath).PlansA+ " - " +this.getView().getModel("odataPromosi").getProperty(sPath).PlansTxtA);
			oIdDivision.setValue(this.getView().getModel("odataPromosi").getProperty(sPath).DiviA+ " - " +this.getView().getModel("odataPromosi").getProperty(sPath).DiviTxtA);
			oIdDepartment.setValue(this.getView().getModel("odataPromosi").getProperty(sPath).DeptA+ " - " +this.getView().getModel("odataPromosi").getProperty(sPath).DeptTxtA);
			oIdSection.setValue(this.getView().getModel("odataPromosi").getProperty(sPath).SectA+ " - " +this.getView().getModel("odataPromosi").getProperty(sPath).SectTxtA);
			
			// console.log('success');
		},
		
		handleValueHelpSelectOrgKey : function (oController) {
			if (!this._valueHelpDialogOrgKey) {
				this._valueHelpDialogOrgKey = sap.ui.xmlfragment(
					"com.sap.build.standard.modulePa.view.ValueHelpDialog.ValueHelpSelectOrgKey",
					this
				);
				this.getView().addDependent(this._valueHelpDialogOrgKey);
			}

			// open value help dialog
			this._valueHelpDialogOrgKey.open();
		},
		
		handleValueHelpOrgKeyClose : function (evt) {
			var oSelectedContexts = evt.getParameter("selectedContexts");
			var sPath = oSelectedContexts[0].sPath;
			var oIdGolongan = this.getView().byId("OrgKeyA");
			oIdGolongan.setValue(this.getView().getModel("odataPromosi").getProperty(sPath).Orgky);
		},
		
		postRequestPromosi: function(){
			//Post
			// var oEntry = {};
			// oEntry.Pernr           = this.EmployeeInformationData.Pernr ;
			// oEntry.Cname           = this.EmployeeInformationData.Cname ;
			// oEntry.PayrollArea     = "" ;
			// oEntry.Rscode          = "" ;
			// oEntry.Status          = "" ;
			// oEntry.StatusTxt       = "" ;
			// oEntry.BegdaC          = this.CurrentOrganizationData.Begda ;
			// oEntry.RequestBy       = "" ;
			// oEntry.EnddaC          = this.CurrentOrganizationData.Endda ;
			// oEntry.RequestDate     = "" ;
			// oEntry.BukrsC          = this.CurrentOrganizationData.Bukrs ;
			// oEntry.EfektifDate     = "" ;
			// oEntry.UnitC           = this.CurrentOrganizationData.Unit ;
			// oEntry.DiviC           = this.CurrentOrganizationData.Divi ;
			// oEntry.DeptC		      = this.CurrentOrganizationData.Dept ;
			// oEntry.SectC		      = this.CurrentOrganizationData.Section ;
			// oEntry.PlansC		  = this.CurrentOrganizationData.Position ;
			// oEntry.StellC	      = this.CurrentOrganizationData.Jabatan ;
			// oEntry.PersC		      = this.CurrentOrganizationData.Persk ;
			// oEntry.LoctnC          = this.CurrentOrganizationData.Loctn ;
			// oEntry.BegdaA          = this.OrganizationAfterTransferData.StartDate ;
			// oEntry.EnddaA          = this.OrganizationAfterTransferData.StartDate ;
			// oEntry.BukrsA          = this.OrganizationAfterTransferData.Company ;
			// oEntry.UnitA           = this.OrganizationAfterTransferData.Unit ;
			// oEntry.DiviA           = this.OrganizationAfterTransferData.Division ;
			// oEntry.DeptA           = this.OrganizationAfterTransferData.Department ;
			// oEntry.SectA           = this.OrganizationAfterTransferData.Section ;
			// oEntry.PlansA          = this.OrganizationAfterTransferData.Position ;
			// oEntry.StellA          = this.OrganizationAfterTransferData.Jabatan ;
			// oEntry.PersA           = this.OrganizationAfterTransferData.Golongan ;
			// oEntry.LoctnA          = this.OrganizationAfterTransferData.Lokasi ;
			// oEntry.Massg           = this.RequestInformationData.ReasonTransfer;
			// oEntry.Zcomment        = this.RequestInformationData.CommentTransfer;
			// oEntry.Busns           = this.EmployeeWorkLocationData.Business ;
			// oEntry.Wilyh           = this.EmployeeWorkLocationData.Wilayah ;
			// oEntry.Rgion           = this.EmployeeWorkLocationData.Region ;
			// oEntry.Bukrs           = this.EmployeeWorkLocationData.CompanyCode ;
			// oEntry.Hombs           = this.EmployeeWorkLocationData.HomeBased ;
			// oEntry.Orgid           = this.OrganizationStructureData.OrganizationId ;
			// oEntry.Dpsec           = this.OrganizationStructureData.DepartmentSection ;
			// oEntry.Jbttl           = this.OrganizationStructureData.JobTitle ;
			// oEntry.Postn           = this.OrganizationStructureData.Position ;
			// oEntry.Otgrp           = this.OrganizationStructureData.SubArea ;
			// oEntry.ChangedDate     = "" ;
			// oEntry.ChangedBy       = "" ;
			
			// ONLY FOR TESTING PURPOSE --------------------------------------------------------------------------------------
			
			// console.log(this.getView().byId("DivisionA").getValue());
			console.log("Post Request pressed..");
			
			var Pernr = this.getView().byId("EmployeeId").getValue();
			var Cname = this.getView().byId("EmployeeName").getValue();
			// var EnddaC = this.getView().byId("StartDateA").getValue();
			//--To be continued (Date -1 Logic)--
			var EndDate = new Date(this.getView().byId("StartDateA").getValue());
			var EndDateYesterday = new Date();
			EndDateYesterday.setDate(EndDate.getDate() - 1).toLocaleDateString();
			// EndDateYesterday.getDate() + '.' + (EndDateYesterday.getMonth()+1) + '.' + EndDateYesterday.getFullYear();
			
			// console.log("Input: ");
			// console.log(EndDate);
			
			console.log("Yesterday: ")
			console.log(EndDateYesterday);
			
			var dateS = '';
			var monthS = '';
			var dateA = '';
			var monthA = '';
			var zero = "0";
			var rawdateS = parseInt(EndDate.getDate());
			var rawmonthS = parseInt(EndDate.getMonth());
			var yearS = EndDate.getFullYear();
			
			console.log(rawdateS +" - "+ rawmonthS +" - "+ yearS);
			
			if (rawdateS<10) {
				dateS = zero.concat(rawdateS);
			}
			else {
				dateS = rawdateS;
			}
			
			if (rawmonthS + 1 <10) {
				monthS = zero.concat(rawmonthS+1);
			}
			else {
				monthS = rawmonthS+1;
			}
			var BegdaA = dateS+"."+monthS+"."+yearS;
			
			var rawdateA = parseInt(EndDateYesterday.getDate());
			var rawmonthA = EndDateYesterday.getMonth();
			var yearA = EndDateYesterday.getFullYear();
			console.log(yearA);
			if (rawdateA<10) {
				dateA = zero.concat(rawdateA);
			}
			else {
				dateA = rawdateA;
			}
			if (rawmonthA + 1 <10) {
				monthA = zero.concat(rawmonthA+1);
			}
			else {
				monthA = rawmonthA+1;
			}
			
			var EnddaA = dateA+"."+monthA+"."+yearA;
			
			// console.log("BegdaA:");
			// console.log(BegdaA);
			
			// console.log("EnddaA:");
			// console.log(EnddaA);
			
			// console.log("Yesterday of Selected Date:");
			// console.log(EndDateYesterday);
			
			
			
			//--Current--
			// var BukrsC = this.getView().byId("BukrsC").getValue();
			// var ButxtC = this.getView().byId("ButxtC").getValue();
			var BukrsC = this.getView().byId("CompanyCodeC").getValue();
			var ButxtC = this.getView().byId("CompanyNameC").getValue();
			var UnitC = this.getView().byId("UnitC").getValue();
			var DivisionC = this.getView().byId("DivisionC").getValue().substr(0,8);
			var DepartmentC = this.getView().byId("DepartmentC").getValue().substr(0,8);
			var SectionC = this.getView().byId("SectionC").getValue().substr(0,8);
			var PositionC = this.getView().byId("PosisiC").getValue().substr(0,8);
			var JabatanC = this.getView().byId("JabatanC").getValue().substr(0,8);
			var GolonganC = this.getView().byId("GolonganC").getValue().substr(0,2);
			var OrgKeyC = this.getView().byId("OrgKeyC").getValue();
			
			//--After Promotion--
			var BukrsA = this.getView().byId("CompanyCode").getValue();
			var ButxtA = this.getView().byId("CompanyName").getValue();
			var UnitA = this.getView().byId("UnitA").getValue();
			var DivisionA = this.getView().byId("DivisionA").getValue().substr(0,8);
			var DepartmentA = this.getView().byId("DepartmentA").getValue().substr(0,8);
			var SectionA = this.getView().byId("SectionA").getValue().substr(0,8);
			var PositionA = this.getView().byId("idPosition").getValue().substr(0,8);
			var JabatanA = this.getView().byId("JabatanA").getValue().substr(0,8);
			var GolonganA = this.getView().byId("idGolongan").getValue().substr(0,2);
			var OrgKeyA = this.getView().byId("OrgKeyA").getValue();
			
			//--Length of Service--
			var HiringDate = this.getView().byId("HiringDate").getValue();
			var LosYear = parseInt(this.getView().byId("LosYear").getValue(), 10);
			var LosMonth = this.getView().byId("LosMonth").getValue();
			var LastPromotionDate = this.getView().byId("LastPromotionDate").getValue();
			
			//--Request Information--
			var Massn = this.getView().byId("ReasonPromotion").getValue().substr(0,2);
			var Massg = this.getView().byId("ReasonPromotion").getValue().substr(3,2);
			var CommentRequest = this.getView().byId("CommentRequest").getValue();
			
			//--Recommendation--
			var Recc = this.getView().byId("Recommendation").getValue();
			
			// console.log(BegdaA);
			
			var oEntry = {};
			// oEntry.Reqid = "test" ;
			oEntry.Vdsk1C = OrgKeyC;
			oEntry.Pernr = Pernr;
			oEntry.Vdsk1TxtC = "";
			oEntry.Status = "" ;
			oEntry.Vdsk1A = OrgKeyA;
			oEntry.Massn = Massn;
			oEntry.Vdsk1TxtA = "" ;
			oEntry.Chngby = "" ;
			oEntry.Massg = Massg;
			oEntry.Cname = Cname;
			oEntry.Appby = "" ;
			oEntry.BukrsC = BukrsC;
			oEntry.UnitC = UnitC;
			oEntry.DiviC = DivisionC;
			oEntry.DeptC = DepartmentC;
			oEntry.SectC = SectionC;
			oEntry.PlansC = PositionC;
			oEntry.StellC = JabatanC;
			oEntry.PerskC = GolonganC;
			oEntry.ButxtC = ButxtC;
			oEntry.DiviTxtC = "" ;
			oEntry.DeptTxtC = "" ;
			oEntry.SectTxtC = "" ;
			oEntry.PlansTxtC = "" ;
			oEntry.StellTxtC = "" ;
			oEntry.BukrsA = BukrsA;
			oEntry.UnitA = UnitA;
			oEntry.DiviA = DivisionA;
			oEntry.DeptA = DepartmentA;
			oEntry.SectA = SectionA;
			oEntry.PlansA = PositionA;
			oEntry.StellA = JabatanA;
			oEntry.PerskA = GolonganA;
			oEntry.ButxtA = ButxtA;
			oEntry.DiviTxtA = "" ;
			oEntry.DeptTxtA = "" ;
			oEntry.SectTxtA = "" ;
			oEntry.PlansTxtA = "" ;
			oEntry.StellTxtA = "" ;
			oEntry.Recc = Recc;
			oEntry.Notif1 = CommentRequest;
			oEntry.StatusTxt = "" ;
			oEntry.Rscode = "" ;
			oEntry.RequestBy = "" ;
			oEntry.Chngdt = "" ;
			oEntry.BegdaC = "" ;
			oEntry.Appdt = "" ;
			oEntry.EnddaC = "" ;
			oEntry.BegdaA = BegdaA;
			oEntry.EnddaA = EnddaA ;
			oEntry.RequestDate = "" ;
			oEntry.EfektifDate = "" ;
			
			console.log(oEntry);
			
			// ---------------------------------------------------------------------------------------------------------------
			
			
			
			
			// console.log("oEntry : ");
			// console.log(oEntry);
			
			// //post the model
			// var busyIndicator = sap.ui.core.BusyIndicator;
			// var sUrl = "/sap/opu/odata/sap/ZHCM_PROMOSI_SRV/";
			// var oModelv2 = new sap.ui.model.odata.v2.ODataModel(sUrl);
			// // var odataMutasi = this.getView().getModel("odataPromosi");
			// oModelv2.attachRequestSent(function () {
			// 	busyIndicator.show(0);
			// });
			// oModelv2.attachRequestCompleted(function () {
			// 	busyIndicator.hide();
			// });
			// oModelv2.setHeaders({
			// 	"X-Requested-With": "X",
			// 	"X-CSRF-Token": "Fetch"
			// });
			// var oThis = this;
			// oModelv2.create("/LISTREQUESTDATAPROMOTIONSet", oEntry, {
			// 	method: "POST",
			// 	success: function (data) {
			// 		MessageBox.success("Employee Promotion is Successfully Requested", {
			// 			onClose: function () {
			// 				// oThis.naviBack();
			// 				// oThis.naviBackToHome();
			// 			}
			// 		});
			// 		// console.log("message : ");
			// 		// console.log(data);
			// 		// oThis.naviBack();
			// 	},
			// 	error: function (e) {
			// 		var vjson = JSON.parse(e.responseText);
			// 		// if (vjson.error.innererror.errordetails.length !== 0) {
			// 		// 	MessageBox.error(vjson.error.innererror.errordetails[0].message + ", " + vjson.error.message.value);
			// 		// } else {
			// 		// 	MessageBox.error(vjson.error.message.value);
			// 		// }
			// 		MessageBox.error(vjson.error.message.value);
			// 	}
			// });

			
		}
		
	});
}, /* bExport= */ true);