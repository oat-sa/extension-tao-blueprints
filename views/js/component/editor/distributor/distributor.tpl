<section class="distributor">
    {{#if data.property.label}}
    <header class="row">
        <div class="label">{{data.property.label}}</div>
        <div class="count">{{__ "Item Count" }}</div>
    </header>
    {{/if}}
    <ul>
    {{#each data.selection}}
        <li class="row" data-uri="{{@key}}">
            <div class="label">{{label}}</div>
            <div class="count">
                <input type="text" value="{{value}}" data-increment="1" data-min="{{../min}}" data-max="{{../max}}" data-zero />
            </div>
        </li>
    {{else}}
        <li class="empty"><em>
        {{#if ../data.property.label}}
            {{../data.property.label}} {{__ 'has no resources.'}}
        {{else}}
            {{__ 'No property defined, please select a property.'}}
        {{/if}}
        </em></li>
    {{/each}}
    </ul>
</section>
