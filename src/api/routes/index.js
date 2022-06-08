const express = require("express");
const router = express.Router();
const passport = require("passport");
const areaRoute = require("./areaRoute");
const userRoute = require("./userRoute");
const authRoute = require("./authRoute");
const controller = require("../controller");
const { apiAuth, validation } = require("../middleware");

const routes = [
  ...areaRoute.areaRoutes,
  ...userRoute.userRoutes,
  ...authRoute.authRoutes,
];

// Applying routes
routes.forEach((route) => {
  let middleware = [(req, res, next) => next()];
  let validationMiddleware = (req, res, next) => {
    validation.validate(req.body, handler);

    next();
  };

  if (route.authenticate) {
    middleware.push(apiAuth);
    middleware.push(passport.authenticate("jwt", { session: false }));
  }

  if (!["get", "delete"].includes(route.method.toLowerCase())) {
    middleware.push(validationMiddleware);
  }

  const handler = route.handler.split(".");

  router[route.method.toLowerCase()](
    route.path,
    ...middleware,
    controller[handler[0]][handler[1]]
  );
  // ex. router.get('/hello', middleware, controller.DefaultController.hello)
});

exports.router = router;
