import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler";
import operatorRouter from "./routes/operator_route";
import machineRouter from "./routes/machine_route";
import voteRouter from "./routes/vote_router";
import permitRouter from "./routes/permit_router";
import authRouter from "./routes/auth_router";
import voterRouter from "./routes/voter_router";
import candidateRouter from "./routes/candidate_router";
import electionRouter from "./routes/election_router";
import constituencyRouter from "./routes/constituency_router";

const apiV1 = "/api/v1";

const app = express();
app.use(express.json());
// Optional: for form submissions
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      "http://localhost:5174",
      "http://localhost:5175",
      "http://localhost:5176",
    ], // frontend URL
    credentials: true, // allow cookies / auth headers
  })
);
app.use("/uploads/user_images", express.static("uploads/user_images"));

//Routes
app.use(`${apiV1}/auth`, authRouter);
app.use(`${apiV1}/operator`, operatorRouter);
app.use(`${apiV1}/machine`, machineRouter);
app.use(`${apiV1}/vote`, voteRouter);
app.use(`${apiV1}/permit`, permitRouter);
app.use(`${apiV1}/voter`, voterRouter);
app.use(`${apiV1}/candidate`, candidateRouter);
app.use(`${apiV1}/election`, electionRouter);
app.use(`${apiV1}/constituency`, constituencyRouter);

app.use(errorHandler);

export default app;
