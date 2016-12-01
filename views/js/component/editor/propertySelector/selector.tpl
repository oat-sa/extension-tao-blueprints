<div class="property-selector">
    {{#if uri}}

    <a href="#" class="selected" data-uri="{{uri}}">{{label}}</a>
    {{else}}
    <a href="#" class="selected empty">{{__ 'Please select a property'}}</a>
    {{/if}}
    <div class="options folded">
        <ul>{{{tree}}}</ul>
    </div>
</div>
