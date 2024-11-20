import winston from "winston";

const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    defaultMeta: { service: "crypto-kings" },
    transports: [
        new winston.transports.Console({
            format: winston.format.simple(),
        })
    ]
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV == "production") {
    logger.add(
        new winston.transports.File({ filename: "error.log", level: "error" })
    );
    logger.add(
        new winston.transports.File({ filename: "combined.log" })
    );
}

export default logger;