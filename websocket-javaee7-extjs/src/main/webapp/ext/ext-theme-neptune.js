Ext.define('ExtThemeNeptune.container.ButtonGroup', {
    override: 'Ext.container.ButtonGroup',
    usePlainButtons: false
});

Ext.define('ExtThemeNeptune.panel.Panel', {
    override: 'Ext.panel.Panel',
    border: 0
});

Ext.define('ExtThemeNeptune.toolbar.Toolbar', {
    override: 'Ext.toolbar.Toolbar',
    usePlainButtons: false
});

Ext.define('ExtThemeNeptune.form.field.HtmlEditor', {
    override: 'Ext.form.field.HtmlEditor',
    defaultButtonUI: 'plain'
});

Ext.define('ExtThemeNeptune.grid.RowEditor', {
    override: 'Ext.grid.RowEditor',
    buttonUI: 'default-toolbar'
});


Ext.define('ExtThemeNeptune.menu.Menu', {
    override: 'Ext.menu.Menu',
    showSeparator: false
});

Ext.define('ExtThemeNeptune.menu.Separator', {
    override: 'Ext.menu.Separator',
    border: 1
});
    

Ext.define('ExtThemeNeptune.panel.Tool', {
    override: 'Ext.panel.Tool',
    height: 24,
    width: 24
});

Ext.define('ExtThemeNeptune.picker.Month', {
    override:  'Ext.picker.Month',
    
    // Monthpicker contains logic that reduces the margins of the month items if it detects
    // that the text has wrapped.  This can happen in the classic theme  in certain
    // locales such as zh_TW.  In order to work around this, Month picker measures
    // the month items to see if the height is greater than "measureMaxHeight".
    // In neptune the height of the items is larger, so we must increase this value.
    // While the actual height of the month items in neptune is 24px, we will only 
    // determine that the text has wrapped if the height of the item exceeds 36px.
    // this allows theme developers some leeway to increase the month item size in
    // a neptune-derived theme.
    measureMaxHeight: 36
});

Ext.define('ExtThemeNeptune.resizer.Splitter', {
    override: 'Ext.resizer.Splitter',
    size: 10
});

Ext.define('ExtThemeNeptune.tab.Tab', {
    override: 'Ext.tab.Tab',
    border: 0
});

Ext.define('ExtThemeNeptune.toolbar.Paging', {
    override: 'Ext.toolbar.Paging',
    defaultButtonUI: 'plain'
});

