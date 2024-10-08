include $(wildcard .env)
export $(shell sed 's/=.*//' .env)

.PHONY: help
help: ## Show this help
	@echo "Usage: make [target]"
	@echo "Targets:"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z0-9_-]+:.*?## / {printf "  %-20s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

.PHONY: dev

run-redis:
	@container_id=$$(docker ps -aq --filter "publish=6379"); \
	echo $$container_id; \
	if [ -z "$$container_id" ]; then \
		echo "Starting redis server..."; \
		docker run -d --rm --name ${REDIS_CONTAINER_NAME} -p 6379:6379 redis:alpine; \
	else \
		echo "Redis server is already running..."; \
	fi

stop-redis:
	@container_id=$$(docker ps -aq --filter "publish=6379"); \
	echo $$container_id; \
	if [ -z "$$container_id" ]; then \
		echo "Redis server is not running..."; \
	else \
		echo "Stopping redis server..."; \
		docker stop ${REDIS_CONTAINER_NAME}; \
	fi

dev: run-redis ## Run the development server
	@echo "Starting development server..."
	@bun dev