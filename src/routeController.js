const V1 = {
    APP_ROUTE: [
        require("./v1/app/router/auth"),
        require("./v1/app/router/violationEvent"),
        require("./v1/app/router/healthProfiling"),
        require("./v1/app/router/app.reportRoadAccident"),
        require("./v1/app/router/app.SOS"),
        require("./v1/app/router/app.asset"),
        require("./v1/app/router/app.bookService"),
        require("./v1/app/router/app.incident"),
        require("./v1/app/router/app.vehicleServiceRegistration"),
        require("./v1/app/router/app.consultation"),
    ],
    ADMIN_ROUTE: [
        require("./v1/Admin/router/admin.lookup"),
        require("./v1/Admin/router/admin.healthProfiling"),
        require("./v1/Admin/router/admin.stationMaster"),
        require("./v1/Admin/router/admin.routes"),
        require("./v1/Admin/router/admin.asset"),
        require("./v1/Admin/router/admin.login"),
        require("./v1/Admin/router/admin.dash"),
        require("./v1/Admin/router/admin.duty"),
        require("./v1/Admin/router/admin.incident"),
    ],
    COMMON_ROUTE: [
        require("./v1/Common/router/lookup"),
        require("./v1/Common/router/imageUpload"),
        require("./v1/Common/router/auth"),
    ],
};
module.exports = { V1 };
