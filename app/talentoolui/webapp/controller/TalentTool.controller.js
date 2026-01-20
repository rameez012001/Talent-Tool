sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("talentoolui.controller.TalentTool", {
        onInit() {
            const oModel = this.getOwnerComponent().getModel();
            this.getView().setModel(oModel);
        },
    });
});