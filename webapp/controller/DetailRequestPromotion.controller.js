sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History"
], function (BaseController, MessageBox, Utilities, History) {
	"use strict";

	return BaseController.extend("com.sap.build.standard.modulePa.controller.DetailRequestPromotion", {
		handleRouteMatched: function (oEvent) {
			// var sAppId = "App60336b1fade8e57e74bdb140";

			// var oParams = {};

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

			// var oPath;

			// if (this.sContext) {
			// 	oPath = {
			// 		path: "/" + this.sContext,
			// 		parameters: oParams
			// 	};
			// 	this.getView().bindObject(oPath);
			// }
			
			var SelectData = sap.ui.getCore().getModel("RequestDetail");
			console.log("Pass Selected Data:");
			console.log(SelectData);
			
			this.getView().setModel(SelectData, "SelectData");
			console.log("Pernr of SelectData : ");
			var employeeid = this.getView().getModel("SelectData").oData.Pernr;
			console.log(employeeid);
			
			// var employeeid = this.getView().getModel(SelectData).getProperty("/oData/Pernr");
			// var employeeid = this.getView().getModel(SelectData).getObject("/"+Pernr);
			// var employeeid = this.getView().getModel().getProperty("/RequestDetail"++"/Pernr");
			// console.log(employeeid);
						
			//Define OData
			this.sUrl = "/sap/opu/odata/sap/ZHCM_PROMOSI_SRV/";
			this.oModelData = new sap.ui.model.odata.ODataModel(this.sUrl, true);
			
			//Define Model LastEducation
			var oModelEdu = this.getOwnerComponent().getModel("DetailRequestPromotion"),
			oViewModelEducation = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oModelEdu);
			this.getView().setModel(oViewModelEducation, "LastEducation");
			//read education data 
			// this.oModelData.read("/LastEducationSet('"+employeeid+"')", {
			this.oModelData.read("/LastEducationSet(Pernr='"+employeeid+"')", {
			  success: function(oData, response) { 
			  	 oViewModelEducation.setData(oData);
			  },
			  error: function(oError) { 
			  	console.log("errorrrrrr");
			  }
			});
			
			//Define Model Length of Service by Employee ID
			var oModelLos = this.getOwnerComponent().getModel("DetailRequestPromotion"),
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
			
			//Defind Model Performance Appraisal by Employee ID
			var oModelPa = this.getOwnerComponent().getModel("DetailRequestPromotion"),
			oViewModelPerformanceAppraisal = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oModelPa);
			this.getView().setModel(oViewModelPerformanceAppraisal, "PerformanceAppraisal");
			this.sUrl = "/sap/opu/odata/sap/ZHCM_PROMOSI_SRV/";
			this.oModelTest = new sap.ui.model.odata.ODataModel(this.sUrl, true);
			//read Performance Appraisal Data
			this.oModelTest.read("/PerfromanceAppraisalsSet(Pernr='"+employeeid+"')", {
				success: function(oData, respionse) {
					oViewModelPerformanceAppraisal.setData(oData);
					// console.log(respionse);
				},
				error: function(oError) {
					// console.log("error nya ini");
					// Need to check on OData
				}
			});
			
			//Defind Model Warning Letter by Employee ID
			var oModelWarning = this.getOwnerComponent().getModel("DetailRequestPromotion"),
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

		},
		onInit: function () {
			// this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			// this.oRouter.getTarget("CreateNewPromotion").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
			
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("DetailRequestPromotion").attachPatternMatched(this.handleRouteMatched, this);
			
			var sUrl = "/sap/opu/odata/sap/ZHCM_PROMOSI_SRV/";
			var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
			oModel.setDefaultCountMode(sap.ui.model.odata.CountMode.inline);
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
		
		updateRequestPromosi: function(){
			//Update
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
			console.log("Update Request pressed..");
			var Reqid = this.getView().byId("RequestId").getValue();
			var Pernr = this.getView().byId("EmployeeId").getValue();
			var Cname = this.getView().byId("EmployeeName").getValue();
			// var EnddaC = this.getView().byId("StartDateA").getValue();
			//--To be continued (Date -1 Logic)--
			var EndDate = new Date(this.getView().byId("StartDateA").getValue());
			var EndDateYesterday = new Date();
			EndDateYesterday.setDate(EndDate.getDate() - 1);
			
			var date = toString(EndDateYesterday).substr(8,2);
			var month = String(EndDateYesterday).substr(5,2);
			var year = EndDateYesterday.toString().substr(0,4);
			var BegdaA = date+"-"+month+"-"+year;
			var EnddaA = this.getView().byId("EndDateA").getValue();
			
			console.log("BegdaA:");
			console.log(BegdaA);
			
			console.log("Yesterday of Selected Date is:");
			console.log(EndDateYesterday);
			
			
			
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
			oEntry.Reqid = Reqid;
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
			
			//put the model
			var busyIndicator = sap.ui.core.BusyIndicator;
			var sUrl = "/sap/opu/odata/sap/ZHCM_PROMOSI_SRV/";
			var oModelv2 = new sap.ui.model.odata.v2.ODataModel(sUrl);
			oModelv2.attachRequestSent(function () {
				busyIndicator.show(0);
			});
			oModelv2.attachRequestCompleted(function () {
				busyIndicator.hide();
			});
			oModelv2.setHeaders({
				"X-Requested-With": "X",
				"X-CSRF-Token": "Fetch"
			});
			var oThis = this;
			oModelv2.update("/LISTREQUESTDATAPROMOTIONSet(Reqid='"+oEntry.Reqid+"',Pernr='"+oEntry.Pernr+"')", oEntry, {
				method: "PUT",
				success: function (data) {
					MessageBox.success("Request Number" + oEntry.Reqid + " is Successfully Updated", {
						onClose: function () {
							// oThis.naviBack();
							// oThis.naviBackToHome();
						}
					});
					// console.log("message : ");
					// console.log(data);
					// oThis.naviBack();
				},
				error: function (e) {
					var vjson = JSON.parse(e.responseText);
					// if (vjson.error.innererror.errordetails.length !== 0) {
					// 	MessageBox.error(vjson.error.innererror.errordetails[0].message + ", " + vjson.error.message.value);
					// } else {
					// 	MessageBox.error(vjson.error.message.value);
					// }
					MessageBox.error(vjson.error.message.value);
				}
			});

			
		}
	});
}, /* bExport= */ true);