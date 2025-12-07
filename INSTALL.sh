#!/bin/bash

# MMM-GoogleCalendar702 Installation Script
# Automated installation for MagicMirror modules directory

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║   MMM-GoogleCalendar702 Installation Script              ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running in MagicMirror modules directory
if [[ ! "$PWD" =~ MagicMirror/modules ]]; then
    echo -e "${RED}❌ Error: Please run this script from your MagicMirror/modules directory${NC}"
    echo ""
    echo "Example:"
    echo "  cd ~/MagicMirror/modules"
    echo "  bash MMM-GoogleCalendar/INSTALL.sh"
    echo ""
    exit 1
fi

# Check Node.js version
echo "Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)

if [ "$NODE_VERSION" -lt 14 ]; then
    echo -e "${RED}❌ Node.js version 14 or higher required${NC}"
    echo "   Current version: $(node -v)"
    echo "   Please upgrade Node.js"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node -v)${NC}"
echo ""

# Install dependencies
echo "Installing npm dependencies..."
cd MMM-GoogleCalendar702 || exit
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependencies installed successfully${NC}"
else
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║   Installation Complete!                                 ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
echo "Next Steps:"
echo ""
echo "1. Set up Google Calendar API:"
echo "   ${YELLOW}npm run setup${NC}"
echo ""
echo "2. Authenticate with Google:"
echo "   ${YELLOW}npm run auth${NC}"
echo ""
echo "3. Add to your config.js:"
echo ""
echo "   {"
echo "       module: \"MMM-GoogleCalendar702\","
echo "       position: \"top_left\","
echo "       config: {"
echo "           view: \"month\","
echo "           size: \"large\","
echo "           theme: \"glass\""
echo "       }"
echo "   }"
echo ""
echo "4. Restart MagicMirror:"
echo "   ${YELLOW}pm2 restart mm${NC}"
echo ""
echo "For detailed instructions, see: README.md"
echo ""
