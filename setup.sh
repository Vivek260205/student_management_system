#!/bin/bash

# Premium Student Management System - Automated Setup Script
# This script sets up the dependencies and runs the project

set -e

echo "======================================"
echo "Premium SMS Setup - Auto Installer"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is installed
echo -e "${YELLOW}Checking prerequisites...${NC}"

if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker is not installed. Please install Docker to continue.${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Docker Compose is not installed. Please install Docker Compose to continue.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker and Docker Compose found${NC}"

# Install backend dependencies
echo -e "\n${YELLOW}Installing backend dependencies...${NC}"
cd backend
if ! mvn clean install -q; then
    echo -e "${RED}Failed to install backend dependencies${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Backend dependencies installed${NC}"
cd ..

# Install frontend dependencies
echo -e "\n${YELLOW}Installing frontend dependencies...${NC}"
cd frontend
if ! npm install -q; then
    echo -e "${RED}Failed to install frontend dependencies${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
cd ..

# Start services with Docker Compose
echo -e "\n${YELLOW}Starting Docker Compose services...${NC}"
docker-compose up --build -d

# Wait for services to be ready
echo -e "\n${YELLOW}Waiting for services to initialize...${NC}"
sleep 15

# Check if containers are running
if [ "$(docker-compose ps -q)" ]; then
    echo -e "${GREEN}✓ Services started successfully${NC}"
else
    echo -e "${RED}Failed to start services${NC}"
    exit 1
fi

echo -e "\n${GREEN}======================================"
echo "Setup Complete!"
echo "=====================================${NC}"

echo -e "\n${YELLOW}Access the application:${NC}"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:8080"
echo "MySQL: localhost:3306"

echo -e "\n${YELLOW}Default Credentials:${NC}"
echo "Username: admin"
echo "Password: adminpass"

echo -e "\n${YELLOW}Useful Commands:${NC}"
echo "View logs: docker-compose logs -f"
echo "Stop services: docker-compose down"
echo "Restart services: docker-compose restart"

echo -e "\n${YELLOW}Next Steps:${NC}"
echo "1. Open browser and go to http://localhost:3000"
echo "2. Login with provided credentials"
echo "3. Navigate to Premium Dashboard (/premium-dashboard)"
echo "4. Explore new Excel Import, Reports, and Analytics features"

echo -e "\n${GREEN}Happy coding! 🚀${NC}"
