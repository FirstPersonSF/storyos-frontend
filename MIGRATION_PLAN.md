# StoryOS Migration Plan - Quick Start

**Created:** January 22, 2025
**Status:** Ready to begin implementation

## What We're Adding

We're migrating 5 core features from the original React app to the Vercel Next.js version:

1. **Instance Variables** - Template customization fields (e.g., company name, dates)
2. **Story Model Swapping** - Change narrative structure after creation
3. **Voice Transformations** - Show rule-based + LLM text transformations
4. **Impact Alerts** - Track when elements change versions
5. **Provenance Tracking** - Complete audit trail of content origins

## Current Status

✅ **Completed:**
- Comprehensive feature audit (see `/MIGRATION_EXECUTIVE_SUMMARY.md`)
- Dependencies installed (axios, react-markdown, @tailwindcss/typography)
- v0 workflow documented (see `/V0_WORKFLOW_GUIDE.md`)
- Basic Deliverables page with static data

⏳ **In Progress:**
- API client setup
- DemoContext state management

## Implementation Order

### Phase 1: Foundation (Now)
1. Create API client (`lib/api/client.ts`)
2. Create DemoContext (`app/context/DemoContext.tsx`)
3. Set up basic data flow

### Phase 2: Core Features
4. Add Instance Variables to demo page
5. Implement Impact Alerts
6. Add Provenance Viewer
7. Implement Story Model Selector
8. Add Voice Transformation display

### Phase 3: Testing
9. Test against Railway backend (`https://web-production-9c58.up.railway.app`)
10. Verify all features work end-to-end

## Key Files to Create

```
storyos-frontend-vercel/storyos-frontend-vercel/
├── lib/
│   └── api/
│       └── client.ts          # API wrapper for backend calls
├── app/
│   ├── context/
│   │   └── DemoContext.tsx    # State management
│   └── components/
│       ├── InstanceFieldsForm.tsx
│       ├── ProvenanceViewer.tsx
│       ├── StoryModelSelector.tsx
│       └── VoiceTransformationDisplay.tsx
```

## Backend API Endpoints

The Railway backend provides these endpoints:

- **Deliverables**: `/deliverables` (CRUD)
- **With Alerts**: `/deliverables/{id}/with-alerts` (includes impact alerts)
- **Elements**: `/unf/elements` (CRUD, versioning)
- **Templates**: `/templates` (get all, create)
- **Voices**: `/voices` (get all)
- **Story Models**: `/story-models` (get all)

## Next Steps

1. **Review migration docs** in `/MIGRATION_EXECUTIVE_SUMMARY.md`
2. **Start with API client** - This unlocks everything else
3. **Test against backend** - Ensure Railway API is accessible
4. **Build incrementally** - One feature at a time
5. **Push to Vercel** - Auto-deploys via GitHub

## Time Estimates

Based on the audit:

- **API Client + Context**: 4-6 hours
- **Instance Variables**: 1-2 hours
- **Impact Alerts**: 2-3 hours
- **Provenance Viewer**: 1-2 hours
- **Story Model Selector**: 3-4 hours
- **Voice Transformations**: 2-3 hours
- **Testing**: 2-3 hours

**Total**: ~16-23 hours of focused work

## Quick Reference

### Original App Location
`/Users/drewf/Desktop/Python/storyos-frontend/`

### Original Components to Port
- `src/components/demo/DeliverableCard.jsx` (most complex, 273 LOC)
- `src/components/demo/InstanceFieldsForm.jsx`
- `src/components/demo/ProvenanceViewer.jsx`
- `src/components/demo/StoryModelSelector.jsx`
- `src/context/DemoContext.jsx`
- `src/api/client.js`

### Backend URL
`https://web-production-9c58.up.railway.app`

### Documentation Files Created
1. `MIGRATION_EXECUTIVE_SUMMARY.md` - High-level overview
2. `storyos_feature_audit.md` - Detailed feature documentation
3. `FILE_REFERENCE_GUIDE.md` - File-by-file reference
4. `component_hierarchy.txt` - Architecture diagrams
5. `V0_WORKFLOW_GUIDE.md` - v0 + GitHub + Vercel workflow

## Design System

Match the existing v0 design:

- **Colors**: `#003A70` (navy), `#0052A3` (hover)
- **Gradients**: Pink → Blue → Navy for numbered badges
- **Typography**: `text-6xl` to `text-9xl` for headings
- **Spacing**: `px-6`, `py-3`, `gap-4` patterns
- **Rounded**: `rounded-lg` for cards and buttons

## Testing Checklist

Before marking migration complete:

- [ ] Can create deliverable with instance fields
- [ ] Impact alerts show when elements update
- [ ] Provenance viewer displays complete audit trail
- [ ] Can swap story models and see re-rendered content
- [ ] Voice transformations display correctly (rule-based + LLM)
- [ ] All buttons and modals work
- [ ] No TypeScript errors
- [ ] Deploys successfully to Vercel

## Questions to Answer

1. Should we connect to Railway backend now, or use static data first?
2. Do we want to migrate all pages or just focus on the demo page?
3. Should we add error boundaries and loading states?
4. Do we need authentication before going live?

## Resources

- **Live Vercel Site**: https://storyos-frontend-git-main-drew-5715s-projects.vercel.app/
- **GitHub Repo**: https://github.com/FirstPersonSF/storyos-frontend
- **Backend API Docs**: https://web-production-9c58.up.railway.app/docs
- **Original App**: http://localhost:5173 (when running)

---

**Ready to start?** Begin with creating the API client in `lib/api/client.ts`!
