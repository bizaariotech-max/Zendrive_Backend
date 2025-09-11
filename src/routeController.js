const V1 = {
    APP_ROUTE: [require("./v1/app/router/auth")],
    ADMIN_ROUTE: [
        require("./v1/Admin/router/admin.lookup"),
        require("./v1/Admin/router/admin.healthProfiling"),
    ],
    COMMON_ROUTE: [
        require("./v1/Common/router/lookup"),
        require("./v1/Common/router/imageUpload"),
    ],
};
module.exports = { V1 };
