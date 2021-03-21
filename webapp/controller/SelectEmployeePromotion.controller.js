sap.ui.define([	
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/ColumnListItem",
	"sap/m/Label",
	"sap/m/SearchField",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (BaseController, MessageBox, History, JSONModel, MessageToast, ColumnListItem, Label, SearchField, Filter, FilterOperator) {
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
			var oIdEmployee = this.getView().byId("idEmployeeID").getValue().substr(0, 8);
			var oEmployeeName = this.getView().byId("idEmployeeID").getValue().substr(11);
			
			console.log(oIdEmployee, oEmployeeName);
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
				EmployeeId: encodeURIComponent(oIdEmployee),
				EmployeeName: encodeURIComponent(oEmployeeName)
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
			// this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			// this.oRouter.getTarget("SelectEmployeePromotion").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
			var sUrl = "/sap/opu/odata/sap/ZHCM_PROMOSI_SRV/";
			var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
			oModel.setDefaultCountMode(sap.ui.model.odata.CountMode.inline);
			this.getView().setModel(oModel,"odataSelectEmployee");
			
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("SelectEmployeePromotion").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
			
			this.getView().setModel(this.oProductsModel);
			this.oColModel = new JSONModel({
			"cols": [
				{
					"label": "Employee Id",
					"template": "Pernr",
					"width": "5rem"
				},
				{
					"label": "Employee Name",
					"template": "Cname"
				},
				{
					"label": "Employee Last Name",
					"template": "Nachn"
				},
				{
					"label": "Personnel Area",
					"template": "Werks"
				},
				{
					"label": "Personnel Subarea",
					"template": "Btrtl"
				},
				{
					"label": "Employee Group",
					"template": "Persg"
				},
				{
					"label": "Employee Subgroup",
					"template": "Persk"
				},
				{
					"label": "Company Code",
					"template": "Bukrs"
				},
				{
					"label": "Cost Center",
					"template": "Kostl"
				},
				{
					"label": "Organizational Unit",
					"template": "Orgeh"
				},
				{
					"label": "Organizational Key",
					"template": "Vdsk1"
				},
				{
					"label": "Administrator Group",
					"template": "Sbmod"
				},
				{
					"label": "Time Administrator",
					"template": "Sachz"
				}
				]
			});
			this.oProductsModel = "";
			// Get the data first
			var oThis = this;
			var sUrl = "/sap/opu/odata/sap/ZHCM_PROMOSI_SRV/";
			var oModel = new sap.ui.model.odata.ODataModel(sUrl);
			var aFilter = [];

		
			// var oPernr = this.getView().byId("idFilterPernr").getValue();
			// aFilter.push(new Filter("Pernr", FilterOperator.EQ, oPernr));
			oModel.read("/SelectEmployeeSet", {
				success: function (oData) {
					var odataResults = oData.results;
					console.log("Odata Results : ");
					console.log(odataResults);
					// var oModel2 = new sap.ui.model.json.JSONModel(odataResults);
					var mockData = {
						"Employee" : odataResults	
					};
					oThis.oProductsModel = new JSONModel(mockData);
					
				},
				error: function (oError) { /* do something */
					MessageBox.error("No purchase order document item found.");
				},
				filters: aFilter
			});
			
			this.getView().setModel(this.oProductsModel);
			
			
		},
		
		// handleValueHelpSelectEmployee : function (oController) {
		// 	if (!this._valueHelpDialogEmployee) {
		// 		this._valueHelpDialogEmployee = sap.ui.xmlfragment(
		// 			"com.sap.build.standard.modulePa.view.ValueHelpDialog.ValueHelpSelectEmployee",
		// 			this
		// 		);
		// 		this.getView().addDependent(this._valueHelpDialogEmployee);
		// 	}
		// 	// open value help dialog
		// 	this._valueHelpDialogEmployee.open();
		// },
		// // var value = getProperty(sPath).Pernr
		// handleValueHelpEmployeeClose : function (evt) {
		// 	var oSelectedContexts = evt.getParameter("selectedContexts");
		// 	var sPath = oSelectedContexts[0].sPath;
		// 	var oIdEmployee = this.getView().byId("idEmployee");
		// 	oIdEmployee.setValue(this.getView().getModel("odataSelectEmployee").getProperty(sPath).Pernr + " - " + this.getView().getModel("odataSelectEmployee").getProperty(sPath).Nachn);
		// },
		
		handleValueHelpSelectEmployee : function (oController) {
			console.log("handleValueHelpSelectEmployee..");
			
			var aCols = this.oColModel.getData().cols;
			// this._Search1 = this.getView().byId("Search1");
			this._oBasicSearchField = new SearchField({
				showSearchButton: false
			});
			
			
			this._oValueHelpDialog = sap.ui.xmlfragment("com.sap.build.standard.modulePa.view.ValueHelpDialog.SelectEmployee", this);
			this.getView().addDependent(this._oValueHelpDialog);
			
			
			var oFilterBar = this._oValueHelpDialog.getFilterBar();
			oFilterBar.setFilterBarExpanded(false);
			oFilterBar.setBasicSearch(this._oBasicSearchField);
			
			this._oValueHelpDialog.getTableAsync().then(function (oTable) {
				oTable.setModel(this.oProductsModel);
				oTable.setModel(this.oColModel, "columns");

				if (oTable.bindRows) {
					oTable.bindAggregation("rows", "/Employee");
				}

				if (oTable.bindItems) {
					
					oTable.bindAggregation("items", "/Employee", function () {
						return new ColumnListItem({
							cells: aCols.map(function (column) {
								return new Label({ text: "{" + column.template + "}" });
							})
						});
					});
				}

				this._oValueHelpDialog.update();
				
			}.bind(this));
			this._oValueHelpDialog.open();
		},
		onValueHelpOkPress: function (oEvent, oSource) {
			console.log(oEvent.getSource()._oSelectedItems.items.undefined);
			this.employeeData = oEvent.getSource()._oSelectedItems.items.undefined ;
			var oIdEmployeeId = this.getView().byId("idEmployeeID");
			oIdEmployeeId.setValue(this.employeeData.Pernr + " - " + this.employeeData.Cname);
			
			this._oValueHelpDialog.close();
		},
		onValueHelpCancelPress: function () {
			this._oValueHelpDialog.close();
		},
		onFilterBarSearch: function (oEvent) {
			console.log("this._oBasicSearchField : ");
			console.log(this._oBasicSearchField);
			var sSearchQuery = this._oBasicSearchField.getValue(),
				aSelectionSet = oEvent.getParameter("selectionSet");
			var aFilters = aSelectionSet.reduce(function (aResult, oControl) {
				if (oControl.getValue()) {
					aResult.push(new Filter({
						path: oControl.getName(),
						operator: FilterOperator.Contains,
						value1: oControl.getValue()
					}));
				}

				return aResult;
			}, []);

			aFilters.push(new Filter({
				filters: [
					new Filter({ path: "Pernr", operator: FilterOperator.Contains, value1: sSearchQuery }),
					new Filter({ path: "Cname", operator: FilterOperator.Contains, value1: sSearchQuery }),
					new Filter({ path: "Bukrs", operator: FilterOperator.Contains, value1: sSearchQuery })
				],
				and: false
			}));

			this._filterTable(new Filter({
				filters: aFilters,
				and: true
			}));
		},
		_filterTable: function (oFilter) {
			var oValueHelpDialog = this._oValueHelpDialog;

			oValueHelpDialog.getTableAsync().then(function (oTable) {
				if (oTable.bindRows) {
					oTable.getBinding("rows").filter(oFilter);
				}

				if (oTable.bindItems) {
					oTable.getBinding("items").filter(oFilter);
				}

				oValueHelpDialog.update();
			});
		}
		
	
	});
}, /* bExport= */ true);