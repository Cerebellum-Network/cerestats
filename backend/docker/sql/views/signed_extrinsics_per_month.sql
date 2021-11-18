CREATE view signed_extrinsics_per_month AS
SELECT to_char(to_timestamp(timestamp)::DATE, 'YYYY-mm') AS "when",
      count(*) AS "volume"
FROM extrinsic
WHERE is_signed = true
GROUP BY 1;