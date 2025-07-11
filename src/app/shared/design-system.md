# ProHub Design System

## Colors

### Primary Colors (Brand Blue)
- `primary-50` to `primary-950`: Main brand color scale
- Use `primary-600` for primary actions
- Use `primary-700` for hover states

### Secondary Colors (Neutral Gray)
- `secondary-50` to `secondary-950`: Text and background colors
- Use `secondary-900` for headings
- Use `secondary-700` for body text
- Use `secondary-500` for muted text

### Accent Colors (Indigo)
- `accent-50` to `accent-950`: Secondary brand color
- Use for highlights and special elements

## Typography

### Headings
```html
<h1 class="heading-xl">Extra Large Heading</h1>
<h2 class="heading-lg">Large Heading</h2>
<h3 class="heading-md">Medium Heading</h3>
<h4 class="heading-sm">Small Heading</h4>
<h5 class="heading-xs">Extra Small Heading</h5>
```

### Body Text
```html
<p class="text-body">Regular body text</p>
<p class="text-caption">Caption text</p>
<p class="text-muted">Muted text</p>
```

## Components

### Buttons
```html
<!-- Primary actions -->
<button class="btn-primary">Primary Button</button>
<button class="btn-primary btn-lg">Large Primary</button>

<!-- Secondary actions -->
<button class="btn-secondary">Secondary Button</button>
<button class="btn-outline">Outline Button</button>
<button class="btn-ghost">Ghost Button</button>

<!-- Accent actions -->
<button class="btn-accent">Accent Button</button>
```

### Cards
```html
<!-- Basic card -->
<div class="card">
  <div class="p-6">
    Card content
  </div>
</div>

<!-- Interactive card -->
<div class="card-interactive">
  <div class="p-6">
    Clickable card content
  </div>
</div>

<!-- Hover effect card -->
<div class="card-hover">
  <div class="p-6">
    Card with hover effect
  </div>
</div>
```

### Form Elements
```html
<!-- Text input -->
<input type="text" class="input" placeholder="Enter text">
<input type="text" class="input input-sm" placeholder="Small input">
<input type="text" class="input input-lg" placeholder="Large input">

<!-- With label -->
<label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
  Label
</label>
<input type="text" class="input">
```

### Badges
```html
<span class="badge-primary">Primary Badge</span>
<span class="badge-secondary">Secondary Badge</span>
<span class="badge-success">Success Badge</span>
<span class="badge-warning">Warning Badge</span>
<span class="badge-error">Error Badge</span>
```

## Layout

### Container
```html
<div class="container-app">
  Content with consistent padding
</div>
```

### Section Padding
```html
<section class="section-padding">
  Section with consistent vertical padding
</section>
```

### Spacing Utilities
```html
<!-- Stack elements with consistent spacing -->
<div class="stack-md">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>

<!-- Cluster elements horizontally -->
<div class="cluster-md">
  <span>Tag 1</span>
  <span>Tag 2</span>
  <span>Tag 3</span>
</div>
```

## Animation

### Standard Animations
```html
<!-- Fade in animation -->
<div class="animate-in">Content</div>

<!-- Hover effects -->
<div class="hover-lift">Lifts on hover</div>
<div class="hover-scale">Scales on hover</div>
```

## Best Practices

1. **Always use design system classes** instead of custom CSS
2. **Maintain dark mode support** with dark: variants
3. **Use semantic color names** (primary, secondary, accent) not specific colors
4. **Follow spacing scale** for consistent layout
5. **Test accessibility** with screen readers and keyboard navigation
6. **Optimize for mobile-first** responsive design
7. **Use loading states** for better UX during data fetching