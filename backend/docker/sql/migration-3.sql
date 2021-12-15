INSERT INTO total (name, count) VALUES ('eth_cere_transfers_amounts', 0);

-- ETH CERE transfer values
START TRANSACTION;
CREATE FUNCTION eth_cere_transfers_values() RETURNS trigger LANGUAGE plpgsql AS
$$BEGIN
  IF NEW.method = 'Transfer' AND SUBSTRING(NEW.data,3, 48) = '5EYCAe5g7bGpFHagwe26HiRHdHdE3hobrwV6hq1UD2BPAiZb' THEN
    IF TG_OP = 'INSERT' THEN
      UPDATE total SET count = count + (CAST(SUBSTRING(NEW.data, '^.{103}(.*?)(?=\])') AS BIGINT)) WHERE name = 'eth_cere_transfers_amounts';
      RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
      UPDATE total SET count = count - (CAST(SUBSTRING(NEW.data, '^.{103}(.*?)(?=\])x') AS BIGINT)) WHERE name = 'eth_cere_transfers_amounts';
      RETURN OLD;
    END IF;
  END IF;
  RETURN NULL;
END;$$;
CREATE CONSTRAINT TRIGGER eth_cere_transfers_values_mod
  AFTER INSERT OR DELETE ON event
  DEFERRABLE INITIALLY DEFERRED
  FOR EACH ROW EXECUTE PROCEDURE eth_cere_transfers_values();
-- TRUNCATE triggers must be FOR EACH STATEMENT
CREATE TRIGGER eth_cere_transfers_values_trunc AFTER TRUNCATE ON event
  FOR EACH STATEMENT EXECUTE PROCEDURE eth_cere_transfers_values();
-- initialize the counter table
UPDATE total SET count = COALESCE((SELECT SUM(CAST(SUBSTRING(data, '^.{103}(.*?)(?=\])') AS BIGINT)) FROM event WHERE SUBSTRING(data,3, 48) = '5EYCAe5g7bGpFHagwe26HiRHdHdE3hobrwV6hq1UD2BPAiZb' AND method = 'Transfer'), 0) WHERE name = 'eth_cere_transfers_amounts';
COMMIT;