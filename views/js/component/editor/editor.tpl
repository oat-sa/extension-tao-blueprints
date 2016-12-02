<section class="blueprint-editor form-content">
    <div class="form-row">
        <label for="label">{{__ 'Target Property'}}</label>
        <div class="property-selector-container"></div>
    </div>
    {{#if data.availableProperties}}
    <div class="distributor-container"></div>
    <div class="controls">
        <button class="btn-info small saver"><span class="icon-save"></span> {{__ 'Save'}}</button>
    </div>
    {{/if}}
</section>
