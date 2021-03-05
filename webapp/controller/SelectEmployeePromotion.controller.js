sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast"
], function (BaseController, MessageBox, Utilities, History, JSONModel, MessageToast) {
	"use strict";

	return BaseController.extend("com.sap.build.standard.modulePa.controller.SelectEmployeePromotion", {
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
		_onButtonPress: function (oEvent) {
		
			var context = oEvent.getSource();
			var oIdEmployee = this.getView().byId("idEmployee").getValue().substr(0, 8);
			// oIdEmployee = "SelectEmployeeSet('"+oIdEmployee +"')";
			// // var oEmployeeName = this.getView().byId("idEmployee").getValue().substr(11);
			// MessageToast.show(oIdEmployee);
			// var oEmployee = {
			//  "Pernr":oIdEmployee
			// };
			

			// // var contextdetail = context.getBindingContext("odataSelectEmployee").getPath().substr(1);
			
			// // path = sItems[i].getBindingContext('foo1').getPath();
			// //	var data = contextdetail.getProperty("PONO");
			// //	MessageToast.show(data);
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("CreateNewPromotion", {
				EmployeeId: encodeURIComponent(oIdEmployee)
			});

			
			// var oBindingContext = oEvent.getSource().getBindingContext();

			// return new Promise(function (fnResolve) {

			// 	this.doNavigate("CreateNewPromotion", oBindingContext, fnResolve, "");
			// }.bind(this)).catch(function (err) {
			// 	if (err !== undefined) {
			// 		MessageBox.error(err.message);
			// 	}
			// });

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
		onInit: function () {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("SelectEmployeePromotion").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
			var sUrl = "/sap/opu/odata/sap/ZHCM_PROMOSI_SRV/";
			var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
			oModel.setDefaultCountMode(sap.ui.model.odata.CountMode.inline);
			this.getView().setModel(oModel,"odataSelectEmployee");
			// console.log("oModel test : ");
			// console.log(oModel);
		},
		
		handleValueHelpSelectEmployee : function (oController) {
			if (!this._valueHelpDialogEmployee) {
				this._valueHelpDialogEmployee = sap.ui.xmlfragment(
					"com.sap.build.standard.modulePa.view.ValueHelpDialog.ValueHelpSelectEmployee",
					this
				);
				this.getView().addDependent(this._valueHelpDialogEmployee);
			}
			// open value help dialog
			this._valueHelpDialogEmployee.open();
		},
		// var value = getProperty(sPath).Pernr
		handleValueHelpEmployeeClose : function (evt) {
			var oSelectedContexts = evt.getParameter("selectedContexts");
			var sPath = oSelectedContexts[0].sPath;
			var oIdEmployee = this.getView().byId("idEmployee");
			oIdEmployee.setValue(this.getView().getModel("odataSelectEmployee").getProperty(sPath).Pernr + " - " + this.getView().getModel("odataSelectEmployee").getProperty(sPath).Nachn);
		}
		
	
	});
}, /* bExport= */ true);