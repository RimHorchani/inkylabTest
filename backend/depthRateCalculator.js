const db = require("./db");

// Function to calculate depth rate per day
/**
 *
 * @param {Date} startDate
 * @param {Date} endDate
 * @param {String} pageUrl
 * @returns depthRate
 * get Depth rate of each date: calculate the sum of eventType 1 values 
    then divide by the count of eventType 1 added to distinct eventType 2 if there is no scroll at the opening of page.
  * For heavy traffic: optimize SQL queries: we could not use JOIN because it is more complex and slowly so we coud add if there
     is no scroll add 0 to eventType 1.
  * What other metrics can we calculate from this database: We could calculate depth rate for each page to know where people stops
     and in which page. 
     Also we could calculate the number of people who uses french, arabic or another language to better know population cible.
 */

async function calculateDepthRate(startDate, endDate, pageUrl) {
  return new Promise((resolve, reject) => {
    // Query the database to retrieve relevant data

    db.all(
      `SELECT
      DATE(Records.createdAt) AS Date,
      COALESCE(
          SUM(CASE
              WHEN Events.eventType = 1 THEN Events.eventValue
              ELSE 0
          END) / NULLIF(
              COUNT(DISTINCT CASE WHEN Events.eventType <> 1 THEN 1 END) +
              COUNT(CASE WHEN Events.eventType = 1 THEN 1 ELSE NULL END),
              0
          ),
          0
      ) AS DepthRate
      FROM Records
      LEFT JOIN Events ON Records.visitId = Events.visitId
      WHERE Records.createdAt >= ? AND Records.createdAt <= ? AND Records.pageUrl = ?
      GROUP BY Date;

      ;
      `,
      [startDate, endDate, pageUrl],
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          // return depth rate list per date between startDate and endDate, and also by pageUrl

          resolve(rows);
        }
      }
    );
  });
}

module.exports = { calculateDepthRate };
