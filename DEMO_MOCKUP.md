# StoryOS Demo Page - Grid Layout Mockup

## Layout Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│  StoryOS Phase 2 Demo                                    [← Back to Home]│
│  Interactive demonstration of voice transformations and impact alerts    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  📝 Create New Deliverable                                       │    │
│  │                                                                   │    │
│  │  Template:        [Brand Manifesto          ▼]                   │    │
│  │  Voice:           [Corporate Brand Voice    ▼]                   │    │
│  │                                                                   │    │
│  │  Instance Fields (optional - based on template):                 │    │
│  │  ┌─────────────────────────────────────────────────────────┐    │    │
│  │  │ Press Release requires: who, what, when, where, why,    │    │
│  │  │ quote1_speaker, quote1_title                            │    │
│  │  │                                                          │    │
│  │  │ who:              [Hexagon AB                          ] │    │
│  │  │ what:             [Announces HxGN SMART Build          ] │    │
│  │  │ when:             [2025-01-15                          ] │    │
│  │  │ where:            [Stockholm, Sweden                   ] │    │
│  │  │ why:              [Transform construction industry     ] │    │
│  │  │ quote1_speaker:   [John Smith                          ] │    │
│  │  │ quote1_title:     [CEO                                 ] │    │
│  │  └─────────────────────────────────────────────────────────┘    │    │
│  │                                                                   │    │
│  │  [Create Deliverable]                                             │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  🎯 Demo Actions                                                 │    │
│  │                                                                   │    │
│  │  Update Element:  [Problem v1.0             ▼] [Update Element]  │    │
│  │  Refresh All:     [Refresh All Deliverables]                     │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                           │
│  ┌────────────── Deliverables (4 total) ──────────────────────┐          │
│                                                                           │
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌────────────────┐ │
│  │ Brand Manifesto      │  │ Brand Manifesto      │  │ Press Release  │ │
│  │ 🔵 Corporate Voice   │  │ 🟢 Product Voice     │  │ 🔵 Corporate   │ │
│  │                      │  │                      │  │                │ │
│  │ Story Model:         │  │ Story Model:         │  │ Story Model:   │ │
│  │ Problem-Agitate-Solve│  │ Problem-Agitate-Solve│  │ Press Release  │ │
│  │                      │  │                      │  │                │ │
│  │ ⚠️  Impact Alerts    │  │ ⚠️  Impact Alerts    │  │ Instance:      │ │
│  │ • Problem: v1.0 →    │  │ • Problem: v1.0 →    │  │ • who: Hexagon │ │
│  │   v1.1 (update)      │  │   v1.1 (update)      │  │ • when: 2025.. │ │
│  │                      │  │                      │  │                │ │
│  │ [View Content ▼]     │  │ [View Content ▼]     │  │ [View ▼]       │ │
│  │ [Refresh] [Delete]   │  │ [Refresh] [Delete]   │  │ [Refresh]      │ │
│  └──────────────────────┘  └──────────────────────┘  └────────────────┘ │
│                                                                           │
│  ┌──────────────────────┐                                                │
│  │ Press Release        │                                                │
│  │ 🟢 Product Voice     │                                                │
│  │                      │                                                │
│  │ Story Model:         │                                                │
│  │ Press Release        │                                                │
│  │                      │                                                │
│  │ Instance:            │                                                │
│  │ • who: Hexagon AB    │                                                │
│  │ • when: 2025-01-15   │                                                │
│  │                      │                                                │
│  │ [View Content ▼]     │                                                │
│  │ [Refresh] [Delete]   │                                                │
│  └──────────────────────┘                                                │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

## Expanded Card View (when "View Content" clicked)

```
┌──────────────────────────────────────────────────────────────────┐
│ Brand Manifesto - Corporate Voice                    [Close ▲]   │
│ 🔵 Corporate Voice                                                │
│                                                                   │
│ Story Model: Problem-Agitate-Solve                               │
│ Template v1.0 | Voice v1.0 | Status: draft                       │
│                                                                   │
│ ⚠️  Impact Alerts                                                 │
│ • Problem: v1.0 → v1.1 (update_available)                        │
│                                                                   │
│ ──────────────────────────────────────────────────────────────── │
│                                                                   │
│ 📄 Problem                                                        │
│ Today's industries must balance growth with responsibility...    │
│ [Full 200+ words of content]                                     │
│                                                                   │
│ 📄 Agitate                                                        │
│ Industries everywhere are transforming faster than ever before,  │
│ driven by autonomous technologies, digitalisation, and the...    │
│ [Full 200+ words of content]                                     │
│                                                                   │
│ 📄 Solve                                                          │
│ 1. **Empowering** – Hexagon AB unlocks human potential...        │
│ 2. **Entrepreneurial** – Hexagon AB acts with curiosity...       │
│ [Full content showing brand terminology]                         │
│                                                                   │
│ ──────────────────────────────────────────────────────────────── │
│                                                                   │
│ 🔍 Transformation Highlights (vs Product Voice):                 │
│ • "automation" → "autonomous technologies" (terminology)         │
│ • "Hexagon AB" vs "we" (perspective shift)                       │
│ • Expanded forms vs contractions (formality)                     │
│                                                                   │
│ [Refresh This Deliverable] [Delete] [Download]                   │
└──────────────────────────────────────────────────────────────────┘
```

## Card States

### Normal Card (No Alerts)
```
┌──────────────────────┐
│ Press Release        │
│ 🟢 Product Voice     │
│                      │
│ Story Model:         │
│ Press Release        │
│                      │
│ Instance:            │
│ • who: Hexagon AB    │
│ • when: 2025-01-15   │
│ • +5 more fields     │
│                      │
│ [View Content ▼]     │
│ [Refresh] [Delete]   │
└──────────────────────┘
```

### Card with Alerts
```
┌──────────────────────┐
│ Brand Manifesto      │
│ 🔵 Corporate Voice   │
│                      │
│ Story Model:         │
│ Problem-Agitate-Solve│
│                      │
│ ⚠️  Impact Alerts    │
│ • Problem: v1.0 →    │
│   v1.1 (update)      │
│ • Agitate: v1.0 →    │
│   v1.2 (update)      │
│                      │
│ [View Content ▼]     │
│ [Refresh] [Delete]   │
└──────────────────────┘
```

### Card Loading State
```
┌──────────────────────┐
│ Brand Manifesto      │
│ 🔵 Corporate Voice   │
│                      │
│ Story Model:         │
│ Problem-Agitate-Solve│
│                      │
│ ⏳ Refreshing...     │
│                      │
│ [View Content ▼]     │
│ [Refresh] [Delete]   │
└──────────────────────┘
```

## Interactive Builder - Template Selection Changes

When user selects "Press Release" template:
```
┌─────────────────────────────────────────────────────────────────┐
│  📝 Create New Deliverable                                       │
│                                                                   │
│  Template:        [Press Release            ▼]                   │
│  Voice:           [Corporate Brand Voice    ▼]                   │
│                                                                   │
│  Instance Fields (required for Press Release):                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ ℹ️  Press Release requires these instance fields:       │    │
│  │                                                          │    │
│  │ who:              [                                    ] │    │
│  │ what:             [                                    ] │    │
│  │ when:             [                                    ] │    │
│  │ where:            [                                    ] │    │
│  │ why:              [                                    ] │    │
│  │ quote1_speaker:   [                                    ] │    │
│  │ quote1_title:     [                                    ] │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                   │
│  [Create Deliverable]                                             │
└─────────────────────────────────────────────────────────────────┘
```

When user selects "Brand Manifesto" template:
```
┌─────────────────────────────────────────────────────────────────┐
│  📝 Create New Deliverable                                       │
│                                                                   │
│  Template:        [Brand Manifesto          ▼]                   │
│  Voice:           [Corporate Brand Voice    ▼]                   │
│                                                                   │
│  ℹ️  Brand Manifesto has no instance fields                      │
│                                                                   │
│  [Create Deliverable]                                             │
└─────────────────────────────────────────────────────────────────┘
```

## Responsive Grid Behavior

### Desktop (>1200px): 3 columns
```
┌─────┐ ┌─────┐ ┌─────┐
│ Card│ │ Card│ │ Card│
└─────┘ └─────┘ └─────┘

┌─────┐ ┌─────┐ ┌─────┐
│ Card│ │ Card│ │ Card│
└─────┘ └─────┘ └─────┘
```

### Tablet (768px-1200px): 2 columns
```
┌─────┐ ┌─────┐
│ Card│ │ Card│
└─────┘ └─────┘

┌─────┐ ┌─────┐
│ Card│ │ Card│
└─────┘ └─────┘
```

### Mobile (<768px): 1 column
```
┌─────┐
│ Card│
└─────┘

┌─────┐
│ Card│
└─────┘

┌─────┐
│ Card│
└─────┘
```

## Color Coding

- 🔵 **Corporate Voice**: Blue accent (#3B82F6)
- 🟢 **Product Voice**: Green accent (#10B981)
- ⚠️  **Impact Alerts**: Yellow background (#FEF3C7), amber border (#F59E0B)
- 📄 **Section Headers**: Gray text (#6B7280)
- ℹ️  **Info Messages**: Blue background (#DBEAFE)

## Key Features in Mockup

1. **Create New Deliverable Builder**
   - Template dropdown (loads all available templates)
   - Voice dropdown (loads all available voices)
   - Dynamic instance field form (appears based on selected template)
   - Clear visual separation from deliverables

2. **Demo Actions Panel**
   - Element update dropdown (for triggering impact alerts)
   - Refresh all button (batch operation)

3. **Deliverable Cards (Grid)**
   - Compact view showing key metadata
   - Color-coded by voice
   - Impact alerts prominently displayed
   - Expandable content sections
   - Individual actions (Refresh, Delete)

4. **Expanded Card View**
   - Full rendered content by section
   - Transformation highlights (what changed due to voice)
   - All metadata visible
   - Download option for future enhancement

5. **Responsive Design**
   - 3 columns on desktop for comparison
   - 2 columns on tablet
   - 1 column on mobile for readability
