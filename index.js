import * as dotenv from "dotenv";
import u from "ak-tools";
import functions from "@google-cloud/functions-framework";
dotenv.config();
import bunyan from "bunyan";
import { LoggingBunyan } from "@google-cloud/logging-bunyan";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
dayjs.extend(utc);
const dateFmt = "MM-DD-YYYY THH";

/*
----
LOGS
----
*/

const loggingBunyan = new LoggingBunyan({ logName: "MY-MODULE" });
const log = bunyan.createLogger({
	name: "MY-MODULE",
	streams: [{ stream: process.stdout, level: "debug" }, loggingBunyan.stream("debug")],
});

/*
----
HANDLER
----
*/

// HTTP
functions.http("go", async (req, res) => {
	try {
		log.info("START");
		const result = await main();
		log.info(result, "COMPLETE!");
		res.send("OK");
	} catch (e) {
		log.error(e, "ERROR!");
	}
});

//PUBSUB
functions.cloudEvent("start", async (cloudEvent) => {
	const pubsubMessage = Buffer.from(cloudEvent.data.message.data, "base64").toString();
	const defaultConfig = {};
	let config;

	try {
		/** @type {import('./index.d.ts').Config}  */
		config = JSON.parse(pubsubMessage);
	} catch (error) {
		log.error({ saw: pubsubMessage }, `ERROR: BAD CONFIG`);
		config = defaultConfig;
	}

	const logLabel = `${dayjs.utc(config?.start_date).format(dateFmt)}`;
	const timer = u.time("job");
	timer.start();
	log.info(config, `START: ${logLabel}`);

	try {
		const receipt = await main(config, false);
		timer.stop(false);
		const duration = timer.report(false).human;
		log.info({ results: receipt, ...config }, `SUCCESS: ${logLabel} | ${duration}`);
		return receipt;
	} catch (error) {
		timer.stop(false);
		const duration = timer.report(false).human;
		log.error({ error: error, ...config }, `FAILURE: ${logLabel} | ${duration}`);
		throw error;
	}
});

/*
----
PIPELINE
----
*/

export async function main(config, isLocal = false) {
	if (isLocal) {
		//something
	} else {
		//something else
	}
	return config;
}

/*
----
HELPERS
----
*/
