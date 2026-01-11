sap.ui.define(['sap/ui/core/mvc/Controller'], function (Controller) {
    "use strict";

    return Controller.extend('talentoolui.controller.UserObject', {

        onInit: function () {
            this.getOwnerComponent()
                .getRouter()
                .getRoute("RouteUserObject")
                .attachPatternMatched(this._onMatched, this);
        },

        _onMatched: function (oEvent) {
            const sId = oEvent.getParameter("arguments").id;

            this.getView().bindElement({
                path: `/Users('${sId}')`,
                events: {
                    change: function () {
                        this.byId("edit").setEnabled(true);
                    }.bind(this)
                }
            });
        }

    });
});
