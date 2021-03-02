sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History"
], function (BaseController, MessageBox, Utilities, History) {
	"use strict";

	return BaseController.extend("com.sap.build.standard.modulePa.controller.DetailRequestPromotion", {
		handleRouteMatched: function (oEvent) {
			var sAppId = "App60336b1fade8e57e74bdb140";

			var oParams = {};

			if (oEvent.mParameters.data.context) {
				this.sContext = oEvent.mParameters.data.context;

			} else {
				if (this.getOwnerComponent().getComponentData()) {
					var patternConvert = function (oParam) {
						if (Object.keys(oParam).length !== 0) {
							for (var prop in oParam) {
								if (prop !== "sourcePrototype" && prop.includes("Set")) {
									return prop + "(" + oParam[prop][0] + ")";
								}
							}
						}
					};

					this.sContext = patternConvert(this.getOwnerComponent().getComponentData().startupParameters);

				}
			}

			var oPath;

			if (this.sContext) {
				oPath = {
					path: "/" + this.sContext,
					parameters: oParams
				};
				this.getView().bindObject(oPath);
			}

		},
		onInit: function () {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("DetailRequestPromotion").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
			var sUrl = "/sap/opu/odata/sap/ZHCM_PROMOSI_SRV/";
			var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
			oModel.setDefaultCountMode(sap.ui.model.odata.CountMode.inline);
			this.getView().setModel(oModel,"odataPromosi");

		}
	});
}, /* bExport= */ true);