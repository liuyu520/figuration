---
layout: doc
title: Migration from v3 to v4
description: A brief rundown of major changes to get you started upgrading from v3 to v4.
group: get-started
toc: true
---

## Notice

Figuration v4 is a considerable rework, and there are a large number of breaking changes across the entire framework.  We will try to explain the changes below.

Some changes will most likely have been missed, so please refer to the documentation pages to see the revised/new implementations.

## Browser Support
- **Support for Internet Explorer 10 has been dropped!** IE 10 is getting old, and the market share is less than 0.1% in terms of global usage according to many trackers.  Plus our use of MutationObservers in the Widgets either needs a polyfill, or things just don't work right.

## Accessibility
- `.sr-only-focusable` does not require `.sr-only` anymore, and elements should not use a combination of the two classes.

## Color
- Reworked the colors, internal palette system, and consolidated the re-used component colors.
- Added functions to check, and/or determine the best color, these can be found in `/scss/functions/_color-util.scss`.
- Extended the contextual colors with light and dark contextual variants.  **These variants are not available as palettes** by default.

## Typography
- Added two methods of Responsive Typography support.
  - Ratio scaling - variable sizing based on viewport dimension
  - Stepped scaling - one defined size per breakpoint
- Inline lists, `.list-inline`, has been dropped and replaced with the `.list-horizontal` modifier in the new [List component]({{ site.path }}/{{ version.docs }}/components/lists/).

## Table
- `.table` now creates a visually simple table, borders are controlled through a selection of modifier classes.
- `.table-hover` and `.table-striped` now use a solid gradient color overlayed using `background-image` to create their visual state.
- `.table-scroll-*` has dropped the `down` portion of the class name, and is now meant to used as a wrapper to prevent conflict with screen-readers due to the use of `display: block`.

## Form
**Forms have recieved a major overhaul.**  Almost everything has been changed, from using `em` sizing by default, along with a simplification in terms of class names and their reusability across multiple input types and visual styles.  A few of the changes are listed below, but there are many that have probably been missed, so it might be better to just review the [forms documentation section]({{ site.path }}/{{ version.docs }}/content/forms/) for a better understanding.

- Rewrote both custom and default checkboxes and radios into a consolidated `.form-check`. Now, both have matching HTML structure (outer `<div>` with sibling `<input>` and `<label>`, and the same layout styles (stacked default, inline with utilitiy classes). This allows us to style the label based on the input's state, simplifying support for the `disabled` attribute (previously requiring a parent class) and better support for form validation.
  - `.custom-control` is replaced with `.form-check`.
  - `.custom-checkbox` and `.custom-radio` modifiers are replaced with `.form-checkradio`, the styling is now determined by the input `type`.
  - added `.form-switch` modifier to make checkbox or radio look like a toggle switch.
  - `.form-check-inline` has been dropped in favor of utility classes.

- Removed `.col-form-legend` in favor of an improved `.form-label`. This way the sizing variants, such as `.form-label-sm` and `.form-label-lg`, can be used on `<legend>` elements also.

- Custom file inputs have been reworked with a new `.form-file` class and markup, replacing `.custom-file`. Along with removing the SCSS map and psuedo-elements. Using children elements in the `<label>`, the `Choose file` text now comes from the `.form-file-text`, and the `Browse` button is now a `.form-file-button` element, allowing for translations right in the HTML.

- Custom select inputs have been reworked also, dropping the `.custom-select`, resulting in a merge into `.form-control`.

- Added custom styling for `input type="range"` with the use for `.form-range`.  The Slider widget has been removed from Figuration and moved into it's own repository: [Figuration Slider](https://github.com/cast-org/figuration-slider).

- Validation icons have been re-implemented.  The `.form-control-icon` has been replaced with `.has-validation-icon`. The icons are still optional and can now be used with textual `<input class="form-control">`, `<textarea class="form-control">`, and `<select class="form-control">` elements.  Icons can be used within `.input-groups` but they no longer scale with the input sizing.

- Dropped `.form-control-color`, `.form-control-range`, and `.form-control-file` . Use the updated `.form-color`, `.form-range` or `.form-file`  classes instead to get a consistent visual input.

{% comment %}
## Sizing
{% endcomment %}

## Grid
- Dropped the `.push` and `.pull` modifiers in favor of `.offset-*` and flex utilities.
- Dropped the `position: relative` from grid columns.
- Horizontal padding is added to the columns only when they are direct children of a row, instead of being added to the columns themselves.
- The column classes can now also be used as stand alone classes to control width, without the additional horizontal padding when used outside a `.row`.
- Responsive gutter classes have been added, to allow control of the gutter size in horizontal and/or vertical directions.

## Components

### Breadbcrumb
- Removed `padding`, `background-color` and `border-radius` from parent `.breadcrumb` element.

### Button
- Added support for CSS checkbox and radio buttons, using `.btn-check` and `.btn-check-input` classes.
- Content in buttons will now wrap by default.  You can use the `.text-nowrap` utility class to preserve old behaviour.

### Card
- Contextually colored cards have been removed. Now you will need to use the with text, background, and border color utilities.
- Cards have been converted to flexbox layout.
- Images need to use some variant of `.card-img{-top/bottom}`, or sometimes it can be a wrapper, to keep aspect ratio and scaling in check due to flexbox, especially with IE.
- List and table sub-components now use a `.card-list` or `.card-table` respectively.
- Responsive horizontal card layouts have been added with `.card-horizontal{breakpoint}`, `.card-horizontal{breakpoint}-reverse`, and child `.card-col` elements.

### Grid Lines
- Grid lines were dropped in favor the updated [Border utility classes]({{ site.path }}/{{ version.docs }}/utilities/borders/#borders).

### Input Group
- Input group addons have been removed, simplifying much of the related CSS. Place your buttons as they would exist anywhere else, but wrap text in `.input-group-text`.
- Validation styles are now supported, as are multiple inputs (though you can only validate one input per group).
- Sizing classes must be on the parent `.input-group` and not the individual form elements.

### List Group
- The List Group is no longer a stand-alone component, and is now modifier within the new [List component]({{ site.path }}/{{ version.docs }}/components/lists/).

### List
- A new component that allows for greater styling options for lists, or pseudo-lists using `<div>`s.

### Pagination
- Pagination has been modified with a couple of style modifier classes for greater flexibility.  The use of the `.pagination-group` modifier class on the `.pagination` element is needed to keep the same look as the older pagination component.

### Switch
- Dropped Switch component and consolidated with the `.form-check` radio and checkbox controls, through the use of the `.form-switch` modifier class. Check out the [new switch custom control]({{ site.path }}/{{ version.docs }}/content/forms/#switch).


## Utilities

### Flexbox
- Renamed `.flex-order` to `.order` to both shorten and also match standard rule name.

### Icons
- The caret utilities have been upgraded to a 4-way style. Since `.dropup` is no longer on the parent container, you may have to change from `.caret` to `.caretup`.

### Image Replacement
- Dropped the `.text-hide` util and `.text-hide()` mixin—in favor of using `.sr-only` as the replacement.


## Widgets

### Button
- Dropped button widget in favor of CSS input buttons.  Single state toggles can be replaced with checkbox `.btn-check` variant.

### Dropdown
- Dropdown has been reworked to use a recursive model, and now uses [Popper.js](https://popper.js.org/) for advanced positioning.  This also had an affect of changing all the available options.
  - There are positioning fallbacks in place if dynamic placement is disabled.
- Menu direction classes have been expanded to use the following alternates: `.dropup`, `.dropreverse`, `.dropend`, `.dropstart`, replacing the previous `.dropdown-menu-reverse` and `.dropdown-menu-forward` classes.
  - The directions classes are now applied directly to the `.dropdown-menu` element, or the submenu `ol`/`ul` list elements, rather than it's parent container.
  - `.dropreverse` replaces `.dropdown-menu-reverse` on primary menus.
  - `.dropend` replaces `.dropdown-menu-reverse` on submenus.
  - `.dropstart` replaces `.dropdown-menu-forward` on all menus.
- The class used to show menus, `.open`, is now used on the `.dropdown-menu` iteself, instead of the parent container.

### Lazy
- Dropped support for jQuery animations as the slim build does not support them.  Added an optional fade-in CSSS animation.

### Player
- Dropped support for sliders using the Slider widget, and added support for `<input type="range">` elements.  A few improvements on the accesibility of the sliders were also added.

### Popover
- Popover now requires [Popper.js](https://popper.js.org/) for positioning, replacing our custom code.  This also means changes to the available options.

### Slider
- Dropped the slider widget as a bundled plugin.  This has been replaced with the `.form-range` styled `<input type="range">` element.

### Tooltip
- Tooltip now requires [Popper.js](https://popper.js.org/) for positioning, replacing our custom code.  This also means changes to the available options.

## Documentation
- We have stopped using Jekyll, and changed to using [Eleventy](https://11ty.dev) to generate the documentation.

## Build Tools
- Figuration now requires Node.js v10 or newer if using our build tools.  This is due to the minimum Node.js requirement for `grunt-sass`.
- The `grunt` directory has been removed, and replaced with a `build` directory.
