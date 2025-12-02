#!/bin/bash
# Test runner script for user-service
# Usage: ./run-tests.sh [options]
#
# Options:
#   --unit          Run only unit tests
#   --integration   Run only integration tests
#   --coverage      Generate coverage report
#   --watch         Run tests in watch mode
#   --clean         Clean test artifacts before running

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}═══════════════════════════════════════════════${NC}"
echo -e "${BLUE}  User Service Test Runner${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════${NC}"

# Parse arguments
TEST_MARKER=""
COVERAGE_ARGS="--cov=. --cov-report=term-missing --cov-report=html"
PYTEST_ARGS="-v"

while [[ $# -gt 0 ]]; do
    case $1 in
        --unit)
            TEST_MARKER="-m unit"
            echo -e "${YELLOW}Running unit tests only${NC}"
            shift
            ;;
        --integration)
            TEST_MARKER="-m integration"
            echo -e "${YELLOW}Running integration tests only${NC}"
            shift
            ;;
        --coverage)
            echo -e "${YELLOW}Generating detailed coverage report${NC}"
            shift
            ;;
        --watch)
            echo -e "${YELLOW}Watch mode not supported in Docker. Use pytest-watch locally.${NC}"
            shift
            ;;
        --clean)
            echo -e "${YELLOW}Cleaning test artifacts...${NC}"
            rm -rf htmlcov/ .coverage .pytest_cache/
            shift
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            exit 1
            ;;
    esac
done

# Run tests in Docker
echo -e "\n${GREEN}🐳 Starting test containers...${NC}\n"

docker-compose -f ../../docker-compose.test.yml up \
    --build \
    --abort-on-container-exit \
    --exit-code-from user-service-test

EXIT_CODE=$?

# Cleanup containers
echo -e "\n${YELLOW}🧹 Cleaning up containers...${NC}"
docker-compose -f ../../docker-compose.test.yml down --volumes

if [ $EXIT_CODE -eq 0 ]; then
    echo -e "\n${GREEN}✅ All tests passed!${NC}"
    echo -e "${GREEN}📊 Coverage report: apps/user-service/htmlcov/index.html${NC}\n"
else
    echo -e "\n${RED}❌ Tests failed!${NC}\n"
fi

exit $EXIT_CODE
