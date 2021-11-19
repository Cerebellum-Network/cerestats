CREATE VIEW signed_extrinsics_per_day_view AS
SELECT *
FROM (SELECT "when"::date FROM generate_series(timestamp '2021-10-16', now(), interval  '1 day') "when") d
LEFT JOIN (
  SELECT to_timestamp(timestamp)::date AS "when", count(*) AS "volume"
  FROM extrinsic
  WHERE is_signed=true
  GROUP BY to_timestamp(timestamp)::date
  ORDER BY to_timestamp(timestamp)::date DESC
) t USING ("when")
ORDER  BY "when";