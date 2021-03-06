---
layout: doc
title: Affix
subtitle: affix.js
description: Affix is used to handle the positioning of components based on the scroll position of the window with top and bottom boundaries.
group: widgets
toc: true
---

## Example
The 'floating' of the 'top of page' link at the bottom of the screen, is a live demo of the widget.

## Usage

Use the affix widget via data attributes or manually with your own JavaScript. **In both situations, you must provide CSS for the positioning of your content.**{.text-danger}

### Positioning via CSS

The affix widget toggles between three classes, each representing a particular state: `.affix`, `.affix-top`, and `.affix-bottom`. You must provide the styles for these classes yourself (independent of this widget) to handle the actual positions.

Here's how the affix widget works:

- To start, the widget adds `.affix-top` to indicate the element is in its top-most position. At this point no CSS positioning is required.
- Scrolling past the element you want affixed should trigger the actual affixing. This is where `.affix` replaces `.affix-top` and sets `position: fixed;` (provided by Figuration's CSS).
- If a `bottom` offset is defined, scrolling past it should replace `.affix` with `.affix-bottom`. Since offsets are optional, setting one requires you to set the appropriate CSS. In this case, add `position: absolute;` when necessary. The widget uses the data attribute or JavaScript option to determine where to position the element from there.

Follow the above steps to set your CSS for either of the usage options below.

### Via Data Attributes

To easily add affix behavior to any element, just add `data-cfw="affix"` to the element you want to spy on. Use offsets to define when to toggle the pinning of an element.

{% capture highlight %}
<div data-cfw="affix" data-cfw-affix-top="60" data-cfw-affix-bottom="200">
  ...
</div>
{% endcapture %}
{% renderHighlight highlight, "html" %}

### Via JavaScript

Activates an element to be affixed. Accepts an optional options object.

Call the affix widget via JavaScript:
{% capture highlight %}
$('#myAffix').CFW_Affix({
  top: 100,
  bottom: function() {
    return ($('.footer').outerHeight(true));
  }
});
{% endcapture %}
{% renderHighlight highlight, "js" %}

### Options

Options can be passed via data attributes or JavaScript. For data attributes, append the option name to `data-cfw-affix-`, as in `data-cfw-affix-top="200"`.

<div class="table-scroll">
  <table class="table table-bordered table-striped">
    <thead>
      <tr>
        <th style="width: 100px;">Name</th>
        <th style="width: 100px;">Type</th>
        <th style="width: 50px;">Default</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>top</code></td>
        <td>number | function</td>
        <td><code>0</code></td>
        <td>Pixel offset from top of the `window` or `target` when calculating position of scroll. Use a function when you need to dynamically calculate an offset.</td>
      </tr>
      <tr>
        <td><code>bottom</code></td>
        <td>number | function</td>
        <td><code>0</code></td>
        <td>Pixel offset from bottom of `window` or `target` when calculating position of scroll. Use a function when you need to dynamically calculate an offset.</td>
      </tr>
      <tr>
        <td><code>target</code></td>
        <td>selector | node | jQuery element</td>
        <td><code>window</code></td>
        <td>Specifies the target element of the affix.</td>
      </tr>
    </tbody>
  </table>
</div>

{% capture highlight %}
$('#myAffix').CFW_Affix({
    top: 10
});
{% endcapture %}
{% renderHighlight highlight, "js" %}

### Methods

Method calls should be made on the affix element.

<div class="table-scroll">
  <table class="table table-bordered table-striped">
    <thead>
      <tr>
        <th style="width: 150px;">Method Name</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>checkPosition</code></td>
        <td>Recalculates the state of the affix based on the dimensions, position, and scroll position of the relevant elements. The <code>.affix</code>, <code>.affix-top</code>, and <code>.affix-bottom</code> classes are added to or removed from the affixed content according to the new state. This method needs to be called whenever the dimensions of the affixed content or the target element are changed, to ensure correct positioning of the affixed content.</td>
      </tr>
      <tr>
        <td><code>dispose</code></td>
        <td>Disables the affix functionality and removes any <code>.affix</code>, <code>.affix-top</code>, or <code>.affix-bottom</code> from the designated element.</td>
      </tr>
    </tbody>
  </table>
</div>

{% capture highlight %}
$('#myAffix').CFW_Affix('checkPosition');
{% endcapture %}
{% renderHighlight highlight, "js" %}

### Events

CFW's affix widget exposes a few events for hooking into affix functionality.

<div class="table-scroll">
  <table class="table table-bordered table-striped">
    <thead>
      <tr>
        <th style="width: 150px;">Event Type</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>init.cfw.affix</code></td>
        <td>This event is fired after the affix element has been initialized.</td>
      </tr>
      <tr>
        <td><code>affix.cfw.affix</code></td>
        <td>This event is immediately before after the element is affixed.</td>
      </tr>
      <tr>
        <td><code>affixed.cfw.affix</code></td>
        <td>This event is after after the element has been affixed.</td>
      </tr>
      <tr>
        <td><code>affix-top.cfw.affix</code></td>
        <td>This event is fired immediately before the element is affixed-top.</td>
      </tr>
      <tr>
        <td><code>affixed-top.cfw.affix</code></td>
        <td>This event is fired after the element has been affixed-top.</td>
      </tr>
      <tr>
        <td><code>affix-bottom.cfw.affix</code></td>
        <td>This event is immediately before after the element is affixed-bottom.</td>
      </tr>
      <tr>
        <td><code>affixed-bottom.cfw.affix</code></td>
        <td>This event is fired after the element has been affixed-bottom.</td>
      </tr>
    </tbody>
  </table>
</div>

{% capture highlight %}
$('#myAffix').on('affix.cfw.affix', function() {
  // do something...
});
{% endcapture %}
{% renderHighlight highlight, "js" %}