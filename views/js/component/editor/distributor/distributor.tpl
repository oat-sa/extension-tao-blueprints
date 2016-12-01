<section class="distributor">
    <header class="row">
        <div class="label">{{data.property.label}}</div>
        <div class="count">{{__ "Item Count" }}</div>
    </header>
    <ul>
    {{#each data.selection}}
        <li class="row" data-uri="{{@key}}">
            <div class="label">{{label}}</div>
            <div class="count">
                <input type="text" value="{{value}}" data-increment="1" data-min="{{../min}}" data-max="{{../max}}" data-zero />
            </div>
        </li>
    {{#else}}
        <li><em>{{data.property.label}} {{__ 'has no resources'}}</em></li>
    {{/each}}
    </ul>
</section>
