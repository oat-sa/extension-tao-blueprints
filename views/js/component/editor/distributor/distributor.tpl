<section class="distributor">
    <header class="row">
        <div class="label">{{__ "Property"}} : {{data.label}}</div>
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
    {{/each}}
    </ul>
</section>
