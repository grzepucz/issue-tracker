import 'babel-polyfill';
import express from 'express';
import logger from 'morgan';
import issuesRouter from './routes/issues';
import mongoose from 'mongoose';
var app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

console.log(process.env.DATABASE_URL);

mongoose.connect(process.env.DATABASE_URL || "mongodb://localhost/issue-tracker", { useNewUrlParser: true, useUnifiedTopology: true });

app.use('/issue', issuesRouter);
app.listen(9000);
export default app;
