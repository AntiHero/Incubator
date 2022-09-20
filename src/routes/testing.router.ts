import { Router } from "express";

import { deleteAll } from "src/controllers/testing/deleteAll";

const testingRouter = Router();

testingRouter.delete('/all-data', deleteAll);

export default testingRouter;
