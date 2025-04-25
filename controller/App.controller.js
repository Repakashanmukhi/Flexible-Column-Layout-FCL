sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/f/library",
  "sap/ui/core/mvc/XMLView"
], (BaseController, fioriLibrary, XMLView) => {
  "use strict";
  var LayoutType = fioriLibrary.LayoutType;
  return BaseController.extend("fcl.controller.App", {
    onInit() {
      this.oEventBus = this.getOwnerComponent().getEventBus();
      this.oEventBus.subscribe("flexible", "setView1", this.setView1, this);
      this.oEventBus.subscribe("flexible", "setView2", this.setView2, this);
      this.oFlexibleColumnLayout = this.byId("FCL");
    },
    setView1: function () {
      this.oFlexibleColumnLayout.setLayout(LayoutType.OneColumn);
    },
    setView2: function (sChannel, sEventId, oData) {
      var oComponent = this.getOwnerComponent();
      var oODataModel = oComponent.getModel();
      oODataModel.read("/EmployeeInfoEmergencyContact", {
        filters: [new sap.ui.model.Filter("EmployeeID", sap.ui.model.FilterOperator.EQ, oData.Data.ID)],
            success: function (response) {
          var oJSONModel = new sap.ui.model.json.JSONModel({
            items: response.results
          });
          oComponent.setModel(oJSONModel, "EmergencyModel");
          this._loadView({
            id: "midView",
            viewName: "fcl.view.View2"
          }).then(function (View2) {
            this.oFlexibleColumnLayout.addMidColumnPage(View2);
            this.oFlexibleColumnLayout.setLayout(LayoutType.TwoColumnsMidExpanded);
          }.bind(this));
        }.bind(this),
        error: function () {
          sap.m.MessageToast.show("Error loading data");
        }
      });
    },
    _loadView: function (options) {
      var mViews = this._mViews = this._mViews || Object.create(null);
      if (!mViews[options.id]) {
        mViews[options.id] = this.getOwnerComponent().runAsOwner(function () {
          return XMLView.create(options);
        });
      }
      return mViews[options.id];
    }
  });
});