import py_eureka_client.eureka_client as eureka_client
import logging
import atexit

logging.basicConfig(level=logging.DEBUG)  # Enable DEBUG logging
logger = logging.getLogger(__name__)

initialized = False

def init_eureka_client():
    global initialized
    if initialized:
        logger.info("Eureka client already initialized")
        return
    try:
        eureka_client.init(
            eureka_server="http://localhost:8761/eureka/",
            app_name="gnn-service",
            instance_host="localhost",
            instance_port=8000,
            instance_ip="127.0.0.1",
            # Remove prefer_ip_address if unsupported
            renewal_interval_in_secs=10,  # 6 heartbeats per minute
            duration_in_secs=30,  # Lease duration
            health_check_url="http://localhost:8000/health/"  # Optional
        )
        initialized = True
        logger.info("Successfully registered GNN service with Eureka")
    except Exception as e:
        logger.error(f"Failed to register with Eureka: {str(e)}")

def stop_eureka_client():
    if initialized:
        try:
            eureka_client.stop()
            logger.info("Unregistered GNN service from Eureka")
        except Exception as e:
            logger.error(f"Failed to unregister from Eureka: {str(e)}")

atexit.register(stop_eureka_client)

if __name__ == "__main__":
    init_eureka_client()