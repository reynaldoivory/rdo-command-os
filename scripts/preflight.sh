#!/bin/bash

# RDO Command OS - Pre-Flight Checklist
# Run this before starting any AI-assisted development session
# Usage: bash scripts/preflight.sh

echo "🚀 RDO Command OS - Pre-Flight Check"
echo "=========================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check 1: .cursorrules exists
echo -n "✓ Checking .cursorrules exists... "
if [ -f .cursorrules ]; then
    echo -e "${GREEN}✅ Found${NC}"
else
    echo -e "${RED}❌ Missing!${NC}"
    echo "  ⚠️  Critical: .cursorrules file not found at project root"
fi

# Check 2: Context-First structure
echo -n "✓ Verifying Context-First structure... "
if [ -d src/context ] && [ -d src/components/widgets ] && [ -d src/components/layout ]; then
    echo -e "${GREEN}✅ Valid${NC}"
else
    echo -e "${RED}❌ Invalid${NC}"
    echo "  ⚠️  Missing: src/context/, src/components/widgets/, or src/components/layout/"
fi

# Check 3: PanelsRegistry exists
echo -n "✓ PanelsRegistry.jsx exists... "
if [ -f src/components/PanelsRegistry.jsx ]; then
    echo -e "${GREEN}✅ Found${NC}"
else
    echo -e "${RED}❌ Missing!${NC}"
    echo "  ⚠️  Critical: PanelsRegistry.jsx not found"
fi

# Check 4: Dashboard orchestrator exists
echo -n "✓ Dashboard.jsx orchestrator exists... "
if [ -f src/components/layout/Dashboard.jsx ]; then
    echo -e "${GREEN}✅ Found${NC}"
else
    echo -e "${YELLOW}⚠️  Missing${NC}"
    echo "  Note: Dashboard.jsx should exist in src/components/layout/"
fi

# Check 5: Node modules installed
echo -n "✓ Node modules installed... "
if [ -d node_modules ]; then
    echo -e "${GREEN}✅ Installed${NC}"
else
    echo -e "${RED}❌ Missing!${NC}"
    echo "  ⚠️  Run: npm install"
fi

# Check 6: Git status
echo ""
echo "✓ Git status:"
if command -v git &> /dev/null; then
    if [ -z "$(git status --porcelain)" ]; then
        echo -e "  ${GREEN}✅ Clean (no uncommitted changes)${NC}"
    else
        echo -e "  ${YELLOW}⚠️  Uncommitted changes detected:${NC}"
        git status --short | head -10
        echo "  Tip: Commit changes before starting new AIOPS task"
    fi
    
    # Show current branch
    BRANCH=$(git branch --show-current)
    echo "  Branch: ${BRANCH}"
    
    # Show last commit
    LAST_COMMIT=$(git log -1 --oneline)
    echo "  Last commit: ${LAST_COMMIT}"
else
    echo -e "  ${RED}❌ Git not available${NC}"
fi

# Check 7: Documentation exists
echo ""
echo "✓ Documentation files:"
DOCS=("docs/AI_OPS_LOG.md" "docs/AI_STACK_WORKFLOW_PLAYBOOK.md" "docs/ARCHITECTURE.md" "docs/CONTEXT_PACKAGE_TEMPLATE.md")
for doc in "${DOCS[@]}"; do
    if [ -f "$doc" ]; then
        echo -e "  ${GREEN}✅${NC} $doc"
    else
        echo -e "  ${YELLOW}⚠️ ${NC} $doc (missing)"
    fi
done

# Check 8: AI Ops Log - Find latest entry
echo ""
echo "✓ Latest AIOPS entry:"
if [ -f docs/AI_OPS_LOG.md ]; then
    LATEST=$(grep -o 'AIOPS-[0-9]\{4\}' docs/AI_OPS_LOG.md | tail -1)
    if [ -n "$LATEST" ]; then
        echo "  Last entry: ${LATEST}"
    else
        echo "  No AIOPS entries found"
    fi
fi

# Final summary
echo ""
echo "=========================================="
echo -e "${GREEN}✅ Pre-Flight Check Complete${NC}"
echo ""
echo "Next Steps:"
echo "1. Review uncommitted changes (if any)"
echo "2. Update docs/CONTEXT_PACKAGE_TEMPLATE.md with current task"
echo "3. Start AI-assisted development session"
echo ""
echo "🚨 Remember: Run 'npm run lint' before committing AI changes"
echo ""
