import express from "express";
import cors from "cors";
import adminRouter from "./routes/admin_route";
import { errorHandler } from "./middlewares/errorHandler";
import voterRouter from "./routes/voter_route";
import candidateRouter from "./routes/candidate_route";
import electionRouter from "./routes/election_route";
import constituencyRouter from "./routes/constituency_route";
import voteRouter from "./routes/vote_route";

const apiV1 = "/api/v1";

const app = express();
app.use(express.json());
// Optional: for form submissions
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/uploads/user_images", express.static("uploads/user_images"));

//Routes
app.use(`${apiV1}/admin`, adminRouter);
app.use(`${apiV1}/voter`, voterRouter);
app.use(`${apiV1}/candidate`, candidateRouter);
app.use(`${apiV1}/election`, electionRouter);
app.use(`${apiV1}/constituency`, constituencyRouter);
app.use(`${apiV1}/vote`, voteRouter);

app.use(errorHandler);

export default app;
