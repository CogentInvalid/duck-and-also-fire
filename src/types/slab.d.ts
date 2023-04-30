// match string from FFfunc to next "end" at start of line:
// FFfunc(\n.*?)*(^end)

type Color = {r: number, g: number, b: number};

/** @noSelf **/
declare interface Slab {
	/**
		Initialize
	
		Initializes Slab and hooks into the required events. This function should be called in love.load.
	
		args: [Table] The list of parameters passed in by the user on the command-line. This should be passed in from
			love.load function. Below is a list of arguments available to modify Slab:
			NoMessages: [string] Disables the messaging system that warns developers of any changes in the API.
			NoDocks: [string] Disables all docks.
	
		Return: None.
	*/
	Initialize: (args) => void;

	/**
		GetVersion
	
		Retrieves the current version of Slab being used as a string.
	
		Return: [string] String of the current Slab version.
	*/
	GetVersion: () => string;

	/**
		GetLoveVersion
	
		Retrieves the current version of Love being used as a string.
	
		Return: [string] String of the current Love version.
	*/
	GetLoveVersion: () => string;

	/**
		Update
	
		Updates the input state and states of various widgets. This function must be called every frame.
		This should be called before any Slab calls are made to ensure proper responses to Input are made.
	
		dt: [number] The delta time for the frame. This should be passed in from love.update.
	
		Return: None.
	*/
	Update: (dt) => void;

	/**
		Draw
	
		This function will execute all buffered draw calls from the various Slab calls made prior. This
		function should be called from love.draw and should be called at the very to ensure Slab is rendered
		above the user's workspace.
	
		Return: None.
	*/
	Draw: () => void;

	/**
		SetINIStatePath
	
		Sets the INI path to save the UI state. If nil, Slab will not save the state to disk.
	
		Return: None.
	*/
	SetINIStatePath: (Path) => void;

	/**
		GetINIStatePath
	
		Gets the INI path to save the UI state. This value can be nil.
	
		Return: [string] The path on disk the UI state will be saved to.
	*/
	GetINIStatePath: () => string;

	/**
		SetVerbose
	
		Enable/Disables internal Slab logging. Could be useful for diagnosing problems that occur inside of Slab.
	
		IsVerbose: [boolean] Flag to enable/disable verbose logging.
	
		Return: None.
	*/
	SetVerbose: (IsVerbose) => void;

	/**
		GetMessages
	
		Retrieves a list of existing messages that has been captured by Slab.
	
		Return: [Table] List of messages that have been broadcasted from Slab.
	*/
	GetMessages: () => any;

	/**
		GetStyle
	
		Retrieve the style table associated with the current instance of Slab. This will allow the user to add custom styling
		to their controls.
	
		Return: [Table] The style table.
	*/
	GetStyle: () => any;

	/**
		PushFont
	
		Pushes a Love font object onto the font stack. All text rendering will use this font until PopFont is called.
	
		Font: [Object] The Love font object to use.
	
		Return: None.
	*/
	PushFont: (Font) => void;

	/**
		PopFont
	
		Pops the last font from the stack.
	
		Return: None.
	*/
	PopFont: () => void;

	/**
		BeginWindow
	
		This function begins the process of drawing widgets to a window. This function must be followed up with
		an EndWindow call to ensure proper behavior of drawing windows.
	
		Id: [string] A unique string identifying this window in the project.
		Options: [Table] List of options that control how this window will behave.
			X: [number] The X position to start rendering the window at.
			Y: [number] The Y position to start rendering the window at.
			W: [number] The starting width of the window.
			H: [number] The starting height of the window.
			ContentW: [number] The starting width of the content contained within this window.
			ContentH: [number] The starting height of the content contained within this window.
			BgColor: [Table] The background color value for this window. Will use the default style WindowBackgroundColor if this is empty.
			Title: [string] The title to display for this window. If emtpy, no title bar will be rendered and the window will not be movable.
			TitleH: [number] The height of the title bar. By default, this will be the height of the current font set in the style. If no title is
				set, this is ignored.
			TitleAlignX: [string] Horizontal alignment of the title. The available options are 'left', 'center', and 'right'. The default is 'center'.
			TitleAlignY: [string] Vertical alignment of the title. The available options are 'top', 'center', and 'bottom'. The default is 'center'.
			AllowMove: [boolean] Controls whether the window is movable within the title bar area. The default value is true.
			AllowResize: [boolean] Controls whether the window is resizable. The default value is true. AutoSizeWindow must be false for this to work.
			AllowFocus: [boolean] Controls whether the window can be focused. The default value is true.
			Border: [number] The value which controls how much empty space should be left between all sides of the window from the content.
				The default value is 4.0
			NoOutline: [boolean] Controls whether an outline should not be rendered. The default value is false.
			IsMenuBar: [boolean] Controls whether if this window is a menu bar or not. This flag should be ignored and is used by the menu bar
				system. The default value is false.
			AutoSizeWindow: [boolean] Automatically updates the window size to match the content size. The default value is true.
			AutoSizeWindowW: [boolean] Automatically update the window width to match the content size. This value is taken from AutoSizeWindow by default.
			AutoSizeWindowH: [boolean] Automatically update the window height to match the content size. This value is taken from AutoSizeWindow by default.
			AutoSizeContent: [boolean] The content size of the window is automatically updated with each new widget. The default value is true.
			Layer: [string] The layer to which to draw this window. This is used internally and should be ignored by the user.
			ResetPosition: [boolean] Determines if the window should reset any delta changes to its position.
			ResetSize: [boolean] Determines if the window should reset any delta changes to its size.
			ResetContent: [boolean] Determines if the window should reset any delta changes to its content size.
			ResetLayout: [boolean] Will reset the position, size, and content. Short hand for the above 3 flags.
			SizerFilter: [Table] Specifies what sizers are enabled for the window. If nothing is specified, all sizers are available. The values can
				be: NW, NE, SW, SE, N, S, E, W
			CanObstruct: [boolean] Sets whether this window is considered for obstruction of other windows and their controls. The default value is true.
			Rounding: [number] Amount of rounding to apply to the corners of the window.
			IsOpen: [boolean] Determines if the window is open. If this value exists within the options, a close button will appear in
				the corner of the window and is updated when this button is pressed to reflect the new open state of this window.
			NoSavedSettings: [boolean] Flag to disable saving this window's settings to the state INI file.
			ConstrainPosition: [boolean] Flag to constrain the position of the window to the bounds of the viewport.
	
		Return: [boolean] The open state of this window. Useful for simplifying API calls by storing the result in a flag instead of a table.
			EndWindow must still be called regardless of the result for this value.
	*/
	BeginWindow: (Id, Options?) => boolean;

	/**
		EndWindow
	
		This function must be called after a BeginWindow and associated widget calls. If the user fails to call this, an assertion will be thrown
		to alert the user.
	
		Return: None.
	*/
	EndWindow: () => void;

	/**
		GetWindowPosition
	
		Retrieves the active window's position.
	
		Return: [number], [number] The X and Y position of the active window.
	*/
	GetWindowPosition: () => LuaMultiReturn<[number, number]>;

	/**
		GetWindowSize
	
		Retrieves the active window's size.
	
		Return: [number], [number] The width and height of the active window.
	*/
	GetWindowSize: () => LuaMultiReturn<[number, number]>;

	/**
		GetWindowContentSize
	
		Retrieves the active window's content size.
	
		Return: [number], [number] The width and height of the active window content.
	*/
	GetWindowContentSize: () => LuaMultiReturn<[number, number]>;

	/**
		GetWindowActiveSize
	
		Retrieves the active window's active size minus the borders.
	
		Return: [number], [number] The width and height of the window's active bounds.
	*/
	GetWindowActiveSize: () => LuaMultiReturn<[number, number]>;

	/**
		IsWindowAppearing
	
		Is the current window appearing this frame. This will return true if BeginWindow has
		not been called for a window over 2 or more frames.
	
		Return: [boolean] True if the window is appearing this frame. False otherwise.
	*/
	IsWindowAppearing: () => boolean;

	/**
		PushID
	
		Pushes a custom ID onto a stack. This allows developers to differentiate between similar controls such as
		text controls.
	
		ID: [string] The custom ID to add.
	
		Return: None.
	*/
	PushID: (ID) => void;

	/**
		PopID
	
		Pops the last custom ID from the stack.
	
		Return: None.
	*/
	PopID: () => void;

	/**
		BeginMainMenuBar
	
		This function begins the process for setting up the main menu bar. This should be called outside of any BeginWindow/EndWindow calls.
		The user should only call EndMainMenuBar if this function returns true. Use BeginMenu/EndMenu calls to add menu items on the main menu bar.
	
		Example:
			if Slab.BeginMainMenuBar() then
				if Slab.BeginMenu("File") then
					if Slab.MenuItem("Quit") then
						love.event.quit()
					end
	
					Slab.EndMenu()
				end
	
				Slab.EndMainMenuBar()
			end
	
		Return: [boolean] Returns true if the main menu bar process has started.
	*/
	BeginMainMenuBar: () => boolean;

	/**
		EndMainMenuBar
	
		This function should be called if BeginMainMenuBar returns true.
	
		Return: None.
	*/
	EndMainMenuBar: () => void;

	/**
		BeginMenuBar
	
		This function begins the process of rendering a menu bar for a window. This should only be called within a BeginWindow/EndWindow context.
	
		IsMainMenuBar: [boolean] Is this menu bar for the main viewport. Used internally. Should be ignored for all other calls.
	
		Return: [boolean] Returns true if the menu bar process has started.
	*/
	BeginMenuBar: (IsMainMenuBar) => boolean;

	/**
		EndMenuBar
	
		This function should be called if BeginMenuBar returns true.
	
		Return: None.
	*/
	EndMenuBar: () => void;

	/**
		BeginMenu
	
		Adds a menu item that when the user hovers over, opens up an additional context menu. When used within a menu bar, BeginMenu calls
		will be added to the bar. Within a context menu, the menu item will be added within the context menu with an additional arrow to notify
		the user more options are available. If this function returns true, the user must call EndMenu.
	
		Label: [string] The label to display for this menu.
		Options: [Table] List of options that control how this menu behaves.
			Enabled: [boolean] Determines if this menu is enabled. This value is true by default. Disabled items are displayed but
				cannot be interacted with.
	
		Return: [boolean] Returns true if the menu item is being hovered.
	*/
	BeginMenu: (Label, Options?) => boolean;

	/**
		EndMenu
	
		Finishes up a BeginMenu. This function must be called if BeginMenu returns true.
	
		Return: None.
	*/
	EndMenu: () => void;

	/**
		BeginContextMenuItem
	
		Opens up a context menu based on if the user right clicks on the last item. This function should be placed immediately after an item
		call to open up a context menu for that specific item. If this function returns true, EndContextMenu must be called.
	
		Example:
			if Slab.Button("Button!") then
				-- Perform logic here when button is clicked
			end
	
			-- This will only return true if the previous button is hot and the user right-clicks.
			if Slab.BeginContextMenuItem() then
				Slab.MenuItem("Button Item 1")
				Slab.MenuItem("Button Item 2")
	
				Slab.EndContextMenu()
			end
	
		Button: [number] The mouse button to use for opening up this context menu.
	
		Return: [boolean] Returns true if the user right clicks on the previous item call. EndContextMenu must be called in order for
			this to function properly.
	boolean/
	BeginContextMenuItem: (Button) => any;

	/**
		BeginContextMenuWindow
	
		Opens up a context menu based on if the user right clicks anywhere within the window. It is recommended to place this function at the end
		of a window's widget calls so that Slab can catch any BeginContextMenuItem calls before this call. If this function returns true,
		EndContextMenu must be called.
	
		Button: [number] The mouse button to use for opening up this context menu.
	
		Return: [boolean] Returns true if the user right clicks anywhere within the window. EndContextMenu must be called in order for this
			to function properly.
	boolean/
	BeginContextMenuWindow: (Button) => any;

	/**
		EndContextMenu
	
		Finishes up any BeginContextMenuItem/BeginContextMenuWindow if they return true.
	
		Return: None.
	*/
	EndContextMenu: () => void;

	/**
		MenuItem
	
		Adds a menu item to a given context menu.
	
		Label: [string] The label to display to the user.
		Options: [Table] List of options that control how this menu behaves.
			Enabled: [boolean] Determines if this menu is enabled. This value is true by default. Disabled items are displayed but
				cannot be interacted with.
	
		Return: [boolean] Returns true if the user clicks on this menu item.
	*/
	MenuItem: (Label, Options?) => boolean;

	/**
		MenuItemChecked
	
		Adds a menu item to a given context menu. If IsChecked is true, then a check mark will be rendered next to the
		label.
	
		Example:
			local Checked = false
			if Slab.MenuItemChecked("Menu Item", Checked)
				Checked = not Checked
			end
	
		Label: [string] The label to display to the user.
		IsChecked: [boolean] Determines if a check mark should be rendered next to the label.
		Options: [Table] List of options that control how this menu behaves.
			Enabled: [boolean] Determines if this menu is enabled. This value is true by default. Disabled items are displayed but
				cannot be interacted with.
	
		Return: [boolean] Returns true if the user clicks on this menu item.
	*/
	MenuItemChecked: (Label, IsChecked, Options?) => boolean;

	/**
		Separator
	
		This functions renders a separator line in the window.
	
		Option: [Table] List of options for how this separator will be drawn.
			IncludeBorders: [boolean] Whether to extend the separator to include the window borders. This is false by default.
			H: [number] The height of the separator. This doesn't change the line thickness, rather, specifies the cursor advancement
				in the Y direction.
			Thickness: [number] The thickness of the line rendered. The default value is 1.0.
	
		Return: None.
	*/
	Separator: (Options) => void;

	/**
		Button
	
		Adds a button to the active window.
	
		Label: [string] The label to display on the button.
		Options: [Table] List of options for how this button will behave.
			Tooltip: [string] The tooltip to display when the user hovers over this button.
			Rounding: [number] Amount of rounding to apply to the corners of the button.
			Invisible: [boolean] Don't render the button, but keep the behavior.
			W: [number] Override the width of the button.
			H: [number] Override the height of the button.
			Disabled: [boolean] If true, the button is not interactable by the user.
			Image: [Table] A table of options used to draw an image instead of a text label. Refer to the 'Image' documentation for a list
				of available options.
			Color: [Table]: The background color of the button when idle. The default value is the ButtonColor property in the Style's table.
			HoverColor: [Table]: The background color of the button when a mouse is hovering the control. The default value is the ButtonHoveredColor property
				in the Style's table.
			PressColor: [Table]: The background color of the button when the button is pressed but not released. The default value is the ButtonPressedColor
				property in the Style's table.
			PadX: [number] Amount of additional horizontal space the background will expand to from the center. The default value is 20.
			PadY: [number] Amount of additional vertical space the background will expand to from the center. The default value is 5.
			VLines: [number] Number of lines in a multiline button text. The default value is 1.
	
		Return: [boolean] Returns true if the user clicks on this button.
	*/
	Button: (Label, Options?) => boolean;

	/**
		RadioButton
	
		Adds a radio button entry to the active window. The grouping of radio buttons is determined by the user. An Index can
		be applied to the given radio button and a SelectedIndex can be passed in to determine if this specific radio button
		is the selected one.
	
		Label: [string] The label to display next to the button.
		Options: [Table] List of options for how this radio button will behave.
			Index: [number] The index of this radio button. Will be 0 by default and not selectable. Assign an index to group the button.
			SelectedIndex: [number] The index of the radio button that is selected. If this equals the Index field, then this radio button
				will be rendered as selected.
			Tooltip: [string] The tooltip to display when the user hovers over the button or label.
	
		Return: [boolean] Returns true if the user clicks on this button.
	*/
	RadioButton: (Label, Options?) => boolean;

	/**
		Text
	
		Adds text to the active window.
	
		Label: [string] The string to be displayed in the window.
		Options: [Table] List of options for how this text is displayed.
			Color: [Table] The color to render the text.
			Pad: [number] How far to pad the text from the left side of the current cursor position.
			IsSelectable: [boolean] Whether this text is selectable using the text's Y position and the window X and width as the
				hot zone.
			IsSelectableTextOnly: [boolean] Will use the text width instead of the window width to determine the hot zone. Will set IsSelectable
				to true if that option is missing.
			IsSelected: [boolean] Forces the hover background to be rendered.
			SelectOnHover: [boolean] Returns true if the user is hovering over the hot zone of this text.
			HoverColor: [Table] The color to render the background if the IsSelected option is true.
			URL: [string] A URL address to open when this text control is clicked.
	
		Return: [boolean] Returns true if SelectOnHover option is set to true. False otherwise.
	*/
	Text: (Label: string, Options?: {
		Color?: Color,
		Pad?: number,
		IsSelectable?: boolean,
		IsSelectableTextOnly?: boolean,
		IsSelected?: boolean,
		SelectOnHover?: boolean,
		HoverColor?: Color,
		URL?: string,
	}) => boolean;

	/**
		TextSelectable
	
		This function is a shortcut for SlabText with the IsSelectable option set to true.
	
		Label: [string] The string to be displayed in the window.
		Options: [Table] List of options for how this text is displayed.
			See Slab.Text for all options.
	
		Return: [boolean] Returns true if user clicks on this text. False otherwise.
	*/
	TextSelectable: (Label, Options?) => boolean;

	/**
		Textf
	
		Adds formatted text to the active window. This text will wrap to fit within the contents of
		either the window or a user specified width.
	
		Label: [string] The text to be rendered.
		Options: [Table] List of options for how this text is displayed.
			Color: [Table] The color to render the text.
			W: [number] The width to restrict the text to. If this option is not specified, then the window
				width is used.
			Align: [string] The alignment to use for this text. For more information, refer to the love documentation
				at https://love2d.org/wiki/AlignMode. Below are the available options:
				center: Align text center.
				left: Align text left.
				right: Align text right.
				justify: Align text both left and right.
	
		Return: None.
	*/
	Textf: (Label, Options?) => void;

	/**
		GetTextSize
	
		Retrieves the width and height of the given text. The result is based on the current font.
	
		Label: [string] The string to retrieve the size for.
	
		Return: [number], [number] The width and height of the given text.
	*/
	GetTextSize: (Label) => LuaMultiReturn<[number, number]>;

	/**
		GetTextWidth
	
		Retrieves the width of the given text. The result is based on the current font.
	
		Label: [string] The string to retrieve the width for.
	
		Return: [number] The width of the given text.
	*/
	GetTextWidth: (Label) => number;

	/**
		GetTextHeight
	
		Retrieves the height of the current font.
	
		Return: [number] The height of the current font.
	*/
	GetTextHeight: () => number;

	/**
		CheckBox
	
		Renders a check box with a label. The check box when enabled will render an 'X'.
	
		Enabled: [boolean] Will render an 'X' within the box if true. Will be an empty box otherwise.
		Label: [string] The label to display after the check box.
		Options: [Table] List of options for how this check box will behave.
			Tooltip: [string] Text to be displayed if the user hovers over the check box.
			Id: [string] An optional Id that can be supplied by the user. By default, the Id will be the label.
			Rounding: [number] Amount of rounding to apply to the corners of the check box.
			Size: [number] The uniform size of the box. The default value is 16.
			Disabled: [boolean] Dictates whether this check box is enabled for interaction.
	
		Return: [boolean] Returns true if the user clicks within the check box.
	*/
	CheckBox: (Enabled, Label, Options?) => boolean;

	/**
		Input
	
		This function will render an input box for a user to input text in. This widget behaves like input boxes
		found in other applications. This function will only return true if it has focus and user has either input
		text or pressed the return key.
	
		Example:
			local Text = "Hello World"
			if Slab.Input('Example', {Text = Text}) then
				Text = Slab.GetInputText()
			end
	
		Id: [string] A string that uniquely identifies this Input within the context of the window.
		Options: [Table] List of options for how this Input will behave.
			Tooltip: [string] Text to be displayed if the user hovers over the Input box.
			ReturnOnText: [boolean] Will cause this function to return true whenever the user has input
				a new character into the Input box. This is true by default.
			Text: [string] The text to be supplied to the input box. It is recommended to use this option
				when ReturnOnText is true.
			TextColor: [Table] The color to use for the text. The default color is the color used for text, but there is also
				a default multiline text color defined in the Style.
			BgColor: [Table] The background color for the input box.
			SelectColor: [Table] The color used when the user is selecting text within the input box.
			SelectOnFocus: [boolean] When this input box is focused by the user, the text contents within the input
				will be selected. This is true by default.
			NumbersOnly: [boolean] When true, only numeric characters and the '.' character are allowed to be input into
				the input box. If no text is input, the input box will display '0'.
			W: [number] The width of the input box. By default, will be 150.0
			H: [number] The height of the input box. By default, will be the height of the current font.
			ReadOnly: [boolean] Whether this input field can be editable or not.
			Align: [string] Aligns the text within the input box. Options are:
				left: Aligns the text to the left. This will be set when this Input is focused.
				center: Aligns the text in the center. This is the default for when the text is not focused.
			Rounding: [number] Amount of rounding to apply to the corners of the input box.
			MinNumber: [number] The minimum value that can be entered into this input box. Only valid when NumbersOnly is true.
			MaxNumber: [number] The maximum value that can be entered into this input box. Only valid when NumbersOnly is true.
			MultiLine: [boolean] Determines whether this input control should support multiple lines. If this is true, then the
				SelectOnFocus flag will be false. The given text will also be sanitized to remove controls characters such as
				'\r'. Also, the text will be left aligned.
			MultiLineW: [number] The width for which the lines of text should be wrapped at.
			Highlight: [Table] A list of key-values that define what words to highlight what color. Strings should be used for
				the word to highlight and the value should be a table defining the color.
			Step: [number] The step amount for numeric controls when the user click and drags. The default value is 1.0.
			NoDrag: [boolean] Determines whether this numberic control allows the user to click and drag to alter the value.
			UseSlider: [boolean] If enabled, displays a slider inside the input control. This will only be drawn if the NumbersOnly
				option is set to true. The position of the slider inside the control determines the value based on the MinNumber
				and MaxNumber option.
	
		Return: [boolean] Returns true if the user has pressed the return key while focused on this input box. If ReturnOnText
			is set to true, then this function will return true whenever the user has input any character into the input box.
	*/
	Input: (Id, Options?) => boolean;

	/**
		InputNumberDrag
	
		This is a wrapper function for calling the Input function which sets the proper options to set up the input box for
		displaying and editing numbers. The user will be able to click and drag the control to alter the value. Double-clicking
		inside this control will allow for manually editing the value.
	
		Id: [string] A string that uniquely identifies this Input within the context of the window.
		Value: [number] The value to display in the control.
		Min: [number] The minimum value that can be set for this number control. If nil, then this value will be set to -math.huge.
		Max: [number] The maximum value that can be set for this number control. If nil, then this value will be set to math.huge.
		Step: [number] The amount to increase value when mouse delta reaches threshold.
		Options: [Table] List of options for how this input control is displayed. See Slab.Input for all options.
	
		Return: [boolean] Returns true whenever this valued is modified.
	*/
	InputNumberDrag: (Id: string, Value: number, Min: number, Max: number, Step: number, Options?) => boolean;

	/**
		InputNumberSlider
	
		This is a wrapper function for calling the Input function which sets the proper options to set up the input box for
		displaying and editing numbers. This will also force the control to display a slider, which determines what the value
		stored is based on the Min and Max options. Double-clicking inside this control will allow for manually editing
		the value.
	
		Id: [string] A string that uniquely identifies this Input within the context of the window.
		Value: [number] The value to display in the control.
		Min: [number] The minimum value that can be set for this number control. If nil, then this value will be set to -math.huge.
		Max: [number] The maximum value that can be set for this number control. If nil, then this value will be set to math.huge.
		Options: [Table] List of options for how this input control is displayed. See Slab.Input for all options.
			Precision: [number] An integer in the range [0..5]. This will set the size of the fractional component.
			NeedDrag: [boolean] This will determine if slider needs to be dragged before changing value, otherwise just clicking in the slider will adjust the value into the clicked value. Default is true.
	
		Return: [boolean] Returns true whenever this valued is modified.
	*/
	InputNumberSlider: (Id, Value, Min, Max, Options?) => boolean;

	/**
		GetInputText
	
		Retrieves the text entered into the focused input box. Refer to the documentation for Slab.Input for an example on how to
		use this function.
	
		Return: [string] Returns the text entered into the focused input box.
	*/
	GetInputText: () => string;

	/**
		GetInputNumber
	
		Retrieves the text entered into the focused input box and attempts to conver the text into a number. Will always return a valid
		number.
	
		Return: [number] Returns the text entered into the focused input box as a number.
	*/
	GetInputNumber: () => number;

	/**
		GetInputCursorPos
	
		Retrieves the position of the input cursor for the focused input control. There are three values that are returned. The first one
		is the absolute position of the cursor with regards to the text for the control. The second is the column position of the cursor
		on the current line. The final value is the line number. The column will match the absolute position if the input control is not
		multi line.
	
		Return: [number], [number], [number] The absolute position of the cursor, the column position of the cursor on the current line,
			and the line number of the cursor. These values will all be zero if no input control is focused.
	*/
	GetInputCursorPos: () => any;

	/**
		IsInputFocused
	
		Returns whether the input control with the given Id is focused or not.
	
		Id: [string] The Id of the input control to check.
	
		Return: [boolean] True if the input control with the given Id is focused. False otherwise.
	*/
	IsInputFocused: (Id) => boolean;

	/**
		IsAnyInputFocused
	
		Returns whether any input control is focused or not.
	
		Return: [boolean] True if there is an input control focused. False otherwise.
	*/
	IsAnyInputFocused: () => boolean;

	/**
		SetInputFocus
	
		Sets the focus of the input control to the control with the given Id. The focus is set at the beginning
		of the next frame to avoid any input events from the current frame.
	
		Id: [string] The Id of the input control to focus.
	*/
	SetInputFocus: (Id) => any;

	/**
		SetInputCursorPos
	
		Sets the absolute text position in bytes of the focused input control. This value is applied on the next frame.
		This function can be combined with the SetInputFocus function to modify the cursor positioning of the desired
		input control. Note that the input control supports UTF8 characters so if the desired position is not a valid
		character, the position will be altered to find the next closest valid character.
	
		Pos: [number] The absolute position in bytes of the text of the focused input control.
	*/
	SetInputCursorPos: (Pos) => any;

	/**
		SetInputCursorPosLine
	
		Sets the column and line number of the focused input control. These values are applied on the next frame. This
		function behaves the same as SetInputCursorPos, but allows for setting the cursor by column and line.
	
		Column: [number] The text position in bytes of the current line.
		Line: [number] The line number to set.
	*/
	SetInputCursorPosLine: (Column, Line) => any;

	/**
		BeginTree
	
		This function will render a tree item with an optional label. The tree can be expanded or collapsed based on whether
		the user clicked on the tree item. This function can also be nested to create a hierarchy of tree items. This function
		will return false when collapsed and true when expanded. If this function returns true, Slab.EndTree must be called in
		order for this tree item to behave properly. The hot zone of this tree item will be the height of the label and the width
		of the window by default.
	
		Id: [String/Table] A string or table uniquely identifying this tree item within the context of the window. If the given Id
			is a table, then the internal Tree entry for this table will be removed once the table has been garbage collected.
		Options: [Table] List of options for how this tree item will behave.
			Label: [string] The text to be rendered for this tree item.
			Tooltip: [string] The text to be rendered when the user hovers over this tree item.
			IsLeaf: [boolean] If this is true, this tree item will not be expandable/collapsable.
			OpenWithHighlight: [boolean] If this is true, the tree will be expanded/collapsed when the user hovers over the hot
				zone of this tree item. If this is false, the user must click the expand/collapse icon to interact with this tree
				item.
			Icon: [Table] List of options to use for drawing the icon. Refer to the 'Image' documentation for more information.
			IsSelected: [boolean] If true, will render a highlight rectangle around the tree item.
			IsOpen: [boolean] Will force the tree item to be expanded.
			NoSavedSettings: [boolean] Flag to disable saving this tree's settings to the state INI file.
	
		Return: [boolean] Returns true if this tree item is expanded. Slab.EndTree must be called if this returns true.
	*/
	BeginTree: (Id, Options?) => boolean;

	/**
		EndTree
	
		Finishes up any BeginTree calls if those functions return true.
	
		Return: None.
	*/
	EndTree: () => void;

	/**
		BeginComboBox
	
		This function renders a non-editable input field with a drop down arrow. When the user clicks this option, a window is
		created and the user can supply their own Slab.TextSelectable calls to add possible items to select from. This function
		will return true if the combo box is opened. Slab.EndComboBox must be called if this function returns true.
	
		Example:
			local Options = {"Apple", "Banana", "Orange", "Pear", "Lemon"}
			local Options_Selected = ""
			if Slab.BeginComboBox('Fruits', {Selected = Options_Selected}) then
				for K, V in pairs(Options) do
					if Slab.TextSelectable(V) then
						Options_Selected = V
					end
				end
	
				Slab.EndComboBox()
			end
	
		Id: [string] A string that uniquely identifies this combo box within the context of the active window.
		Options: [Table] List of options that control how this combo box behaves.
			Tooltip: [string] Text that is rendered when the user hovers over this combo box.
			Selected: [string] Text that is displayed in the non-editable input box for this combo box.
			W: [number] The width of the combo box. The default value is 150.0.
			Rounding: [number] Amount of rounding to apply to the corners of the combo box.
	
		Return: [boolean] This function will return true if the combo box is open.
	*/
	BeginComboBox: (Id, Options?) => boolean;

	/**
		EndComboBox
	
		Finishes up any BeginComboBox calls if those functions return true.
	
		Return: None.
	*/
	EndComboBox: () => void;

	/**
		Image
	
		Draws an image at the current cursor position. The Id uniquely identifies this
		image to manage behaviors with this image. An image can be supplied through the
		options or a path can be specified which Slab will manage the loading and storing of
		the image reference.
	
		Id: [string] A string uniquely identifying this image within the context of the current window.
		Options: [Table] List of options controlling how the image should be drawn.
			Image: [Object] A user supplied image. This must be a valid Love image or the call will assert.
			Path: [string] If the Image option is nil, then a path must be specified. Slab will load and
				manage the image resource.
			Rotation: [number] The rotation value to apply when this image is drawn.
			Scale: [number] The scale value to apply to both the X and Y axis.
			ScaleX: [number] The scale value to apply to the X axis.
			ScaleY: [number] The scale value to apply to the Y axis.
			Color: [Table] The color to use when rendering this image.
			SubX: [number] The X-coordinate used inside the given image.
			SubY: [number] The Y-coordinate used inside the given image.
			SubW: [number] The width used inside the given image.
			SubH: [number] The height used insided the given image.
			WrapX: [string] The horizontal wrapping mode for this image. The available options are 'clamp', 'repeat',
				'mirroredrepeat', and 'clampzero'. For more information refer to the Love2D documentation on wrap modes at
				https://love2d.org/wiki/WrapMode.
			WrapY: [string] The vertical wrapping mode for this image. The available options are 'clamp', 'repeat',
				'mirroredrepeat', and 'clampzero'. For more information refer to the Love2D documentation on wrap modes at
				https://love2d.org/wiki/WrapMode.
			UseOutline: [boolean] If set to true, a rectangle will be drawn around the given image. If 'SubW' or 'SubH' are specified, these
				values will be used instead of the image's dimensions.
			OutlineColor: [Table] The color used to draw the outline. Default color is black.
			OutlineW: [number] The width used for the outline. Default value is 1.
			W: [number] The width the image should be resized to.
			H: [number] The height the image should be resized to.
	
		Return: None.
	*/
	Image: (Id, Options?) => void;

	/**
		SameLine
	
		This forces the cursor to move back up to the same line as the previous widget. By default, all Slab widgets will
		advance the cursor to the next line based on the height of the current line. By using this call with other widget
		calls, the user will be able to set up multiple widgets on the same line to control how a window may look.
	
		Options: [Table] List of options that controls how the cursor should handle the same line.
			Pad: [number] Extra padding to apply in the X direction.
			CenterY: [boolean] Controls whether the cursor should be centered in the Y direction on the line. By default
				the line will use the NewLineSize, which is the height of the current font to center the cursor.
	
		Return: None.
	*/
	SameLine: (Options) => void;

	/**
		NewLine
	
		This forces the cursor to advance to the next line based on the height of the current font.
	
		Return: None.
	*/
	NewLine: () => void;

	/**
		SetCursorPos
	
		Sets the cursor position. The default behavior is to set the cursor position relative to
		the current window. The absolute position can be set if the 'Absolute' option is set.
	
		Controls will only be drawn within a window. If the cursor is set outside of the current
		window context, the control will not be displayed.
	
		X: [number] The X coordinate to place the cursor. If nil, then the X coordinate is not modified.
		Y: [number] The Y coordinate to place the cursor. If nil, then the Y coordinate is not modified.
		Options: [Table] List of options that control how the cursor position should be set.
			Absolute: [boolean] If true, will place the cursor using absolute coordinates.
	
		Return: None.
	*/
	SetCursorPos: (X, Y, Options?) => void;

	/**
		GetCursorPos
	
		Gets the cursor position. The default behavior is to get the cursor position relative to
		the current window. The absolute position can be retrieved if the 'Absolute' option is set.
	
		Options: [Table] List of options that control how the cursor position should be retrieved.
			Absolute: [boolean] If true, will return the cursor position in absolute coordinates.
	
		Return: [number], [number] The X and Y coordinates of the cursor.
	*/
	GetCursorPos: (Options) => LuaMultiReturn<[number, number]>;

	/**
		Indent
	
		Advances the anchored X position of the cursor. All subsequent lines will begin at the new cursor position. This function
		has no effect when columns are present.
	
		Width: [number] How far in pixels to advance the cursor. If nil, then the default value identified by the 'Indent'
			property in the current style is used.
	
		Return: None.
	*/
	Indent: (Width) => void;

	/**
		Unindent
	
		Retreats the anchored X position of the cursor. All subsequent lines will begin at the new cursor position. This function
		has no effect when columns are present.
	
		Width: [number] How far in pixels to retreat the cursor. If nil, then the default value identified by the 'Indent'
			property in the current style is used.
	
		Return: None.
	*/
	Unindent: (Width) => void;

	/**
		Properties
	
		Iterates through the table's key-value pairs and adds them to the active window. This currently only does
		a shallow loop and will not iterate through nested tables.
	
		TODO: Iterate through nested tables.
	
		Table: [Table] The list of properties to build widgets for.
		Options: [Table] List of options that can applied to a specific property. The key should match an entry in the
			'Table' argument and will apply any additional options to the property control.
		Fallback: [Table] List of options that can be applied to any property if an entry was not found in the 'Options'
			argument.
	
		Return: None.
	*/
	Properties: (Table, Options, Fallback) => void;

	/**
		BeginListBox
	
		Begins the process of creating a list box. If this function is called, EndListBox must be called after all
		items have been added.
	
		Id: [string] A string uniquely identifying this list box within the context of the current window.
		Options: [Table] List of options controlling the behavior of the list box.
			W: [number] The width of the list box. If nil, a default value of 150 is used.
			H: [number] The height of the list box. If nil, a default value of 150 is used.
			Clear: [boolean] Clears out the items in the list. It is recommended to only call this if the list items
				has changed and should not be set to true on every frame.
			Rounding: [number] Amount of rounding to apply to the corners of the list box.
			StretchW: [boolean] Stretch the list box to fill the remaining width of the window.
			StretchH: [boolean] Stretch the list box to fill the remaining height of the window.
	
		Return: None.
	*/
	BeginListBox: (Id, Options?) => void;

	/**
		EndListBox
	
		Ends the list box container. Will close off the region and properly adjust the cursor.
	
		Return: None.
	*/
	EndListBox: () => void;

	/**
		BeginListBoxItem
	
		Adds an item to the current list box with the given Id. The user can then draw controls however they see
		fit to display a single item. This allows the user to draw list items such as a texture with a name or just
		a text to represent the item. If this is called, EndListBoxItem must be called to complete the item.
	
		Id: [string] A string uniquely identifying this item within the context of the current list box.
		Options: [Table] List of options that control the behavior of the active list item.
			Selected: [boolean] If true, will draw the item with a selection background.
	
		Return: None.
	*/
	BeginListBoxItem: (Id, Options?) => void;

	/**
		IsListBoxItemClicked
	
		Checks to see if a hot list item is clicked. This should only be called within a BeginListBoxLitem/EndListBoxItem
		block.
	
		Button: [number] The button to check for the click of the item.
		IsDoubleClick: [boolean] Check for double-click instead of single click.
	
		Return: [boolean] Returns true if the active item is hovered with mouse and the requested mouse button is clicked.
	*/
	IsListBoxItemClicked: (Button, IsDoubleClick) => boolean;

	/**
		EndListBoxItem
	
		Ends the current item and commits the bounds of the item to the list.
	
		Return: None.
	*/
	EndListBoxItem: () => void;

	/**
		OpenDialog
	
		Opens the dialog box with the given Id. If the dialog box was opened, then it is pushed onto the stack.
		Calls to the BeginDialog with this same Id will return true if opened.
	
		Id: [string] A string uniquely identifying this dialog box.
	
		Return: None.
	*/
	OpenDialog: (Id) => void;

	/**
		BeginDialog
	
		Begins the dialog window with the given Id if it is open. If this function returns true, then EndDialog must be called.
		Dialog boxes are windows which are centered in the center of the viewport. The dialog box cannot be moved and will
		capture all input from all other windows.
	
		Id: [string] A string uniquely identifying this dialog box.
		Options: [Table] List of options that control how this dialog box behaves. These are the same parameters found
			for BeginWindow, with some caveats. Certain options are overridden by the Dialog system. They are:
				X, Y, Layer, AllowFocus, AllowMove, and AutoSizeWindow.
	
		Return: [boolean] Returns true if the dialog with the given Id is open.
	*/
	BeginDialog: (Id, Options?) => boolean;

	/**
		EndDialog
	
		Ends the dialog window if a call to BeginDialog returns true.
	
		Return: None.
	*/
	EndDialog: () => void;

	/**
		CloseDialog
	
		Closes the currently active dialog box.
	
		Return: None.
	*/
	CloseDialog: () => void;

	/**
		MessageBox
	
		Opens a message box to be displayed to the user with a title and a message. Buttons can be specified through the options
		table which when clicked, the string of the button is returned. This function should be called every frame when a message
		box wants to be displayed.
	
		Title: [string] The title to display for the message box.
		Message: [string] The message to be displayed. The text is aligned in the center. Multi-line strings are supported.
		Options: [Table] List of options to control the behavior of the message box.
			Buttons: [Table] List of buttons to display with the message box. The order of the buttons are displayed from right to left.
	
		Return: [string] The name of the button that was clicked. If none was clicked, an emtpy string is returned.
	*/
	MessageBox: (Title, Message, Options?) => string;

	/**
		FileDialog
	
		Opens up a dialog box that displays a file explorer for opening or saving files or directories. This function does not create any file
		handles, it just returns the list of files selected by the user.
	
		Options: [Table] List of options that control the behavior of the file dialog.
			AllowMultiSelect: [boolean] Allows the user to select multiple items in the file dialog.
			Directory: [string] The starting directory when the file dialog is open. If none is specified, the dialog
				will start at love.filesystem.getSourceBaseDirectory and the dialog will remember the last
				directory navigated to by the user between calls to this function.
			Type: [string] The type of file dialog to use. The options are:
				openfile: This is the default method. The user will have access to both directories and files. However,
					only file selections are returned.
				opendirectory: This type is used to filter the file dialog for directories only. No files will appear
					in the list.
				savefile: This type is used to select a name of a file to save. The user will be prompted if they wish to overwrite
					an existing file.
			Filters: [Table] A list of filters the user can select from when browsing files. The table can contain tables or strings.
				Table: If a table is used for a filter, it should contain two elements. The first element is the filter while the second
					element is the description of the filter e.g. {"*.lua", "Lua Files"}
				String: If a raw string is used, then it should just be the filter. It is recommended to use the table option since a
					description can be given for each filter.
			IncludeParent: [boolean] This option will include the parent '..' directory item in the file/dialog list. This option is
				true by default.
	
		Return: [Table] Returns items for how the user interacted with this file dialog.
			Button: [string] The button the user clicked. Will either be OK or Cancel.
			Files: [Table] An array of selected file items the user selected when OK is pressed. Will be empty otherwise.
	*/
	FileDialog: (Options) => any;

	/**
		ColorPicker
	
		Displays a window to allow the user to pick a hue and saturation value of a color. This should be called every frame and the result
		should be handled to stop displaying the color picker and store the resulting color.
	
		Options: [Table] List of options that control the behavior of the color picker.
			Color: [Table] The color to modify. This should be in the format of 0-1 for each color component (RGBA).
	
		Return: [Table] Returns the button and color the user has selected.
			Button: [number] The button the user clicked. 1 - OK. 0 - No Interaction. -1 - Cancel.
			Color: [Table] The new color the user has chosen. This will always be returned.
	*/
	ColorPicker: (Options) => any;

	/**
		IsMouseDown
	
		Determines if a given mouse button is down.
	
		Button: [number] The button to check for. The valid numbers are: 1 - Left, 2 - Right, 3 - Middle.
	
		Return: [boolean] True if the given button is down. False otherwise.
	*/
	IsMouseDown: (Button) => boolean;

	/**
		IsMouseClicked
	
		Determines if a given mouse button changes state from up to down this frame.
	
		Button: [number] The button to check for. The valid numbers are: 1 - Left, 2 - Right, 3 - Middle.
	
		Return: [boolean] True if the given button changes state from up to down. False otherwise.
	*/
	IsMouseClicked: (Button) => boolean;

	/**
		IsMouseReleased
	
		Determines if a given mouse button changes state from down to up this frame.
	
		Button: [number] The button to check for. The valid numbers are: 1 - Left, 2 - Right, 3 - Middle.
	
		Return: [boolean] True if the given button changes state from down to up. False otherwise.
	*/
	IsMouseReleased: (Button) => boolean;

	/**
		IsMouseDoubleClicked
	
		Determines if a given mouse button has been clicked twice within a given time frame.
	
		Button: [number] The button to check for. The valid numbers are: 1 - Left, 2 - Right, 3 - Middle.
	
		Return: [boolean] True if the given button was double clicked. False otherwise.
	*/
	IsMouseDoubleClicked: (Button) => boolean;

	/**
		IsMouseDragging
	
		Determines if a given mouse button is down and there has been movement.
	
		Button: [number] The button to check for. The valid numbers are: 1 - Left, 2 - Right, 3 - Middle.
	
		Return: [boolean] True if the button is held down and is moving. False otherwise.
	*/
	IsMouseDragging: (Button) => boolean;

	/**
		GetMousePosition
	
		Retrieves the current mouse position in the viewport.
	
		Return: [number], [number] The X and Y coordinates of the mouse position.
	*/
	GetMousePosition: () => LuaMultiReturn<[number, number]>;

	/**
		GetMousePositionWindow
	
		Retrieves the current mouse position within the current window. This position will include any transformations
		added to the window such as scrolling.
	
		Return: [number], [number] The X and Y coordinates of the mouse position within the window.
	*/
	GetMousePositionWindow: () => LuaMultiReturn<[number, number]>;

	/**
		GetMouseDelta
	
		Retrieves the change in mouse coordinates from the last frame.
	
		Return: [number], [number] The X and Y coordinates of the delta from the last frame.
	*/
	GetMouseDelta: () => LuaMultiReturn<[number, number]>;

	/**
		SetCustomMouseCursor
	
		Overrides a system mouse cursor of the given type to render a custom image instead.
	
		Type: [string] The system cursor type to replace. This can be one of the following values: 'arrow', 'sizewe', 'sizens', 'sizenesw', 'sizenwse', 'ibeam', 'hand'.
		Image: [Table] An 'Image' object created from love.graphics.newImage. If this is nil, then an empty image is created and is drawn when the system cursor is activated.
		Quad: [Table] A 'Quad' object created from love.graphics.newQuad. This allows support for setting UVs of an image to render.
	*/
	SetCustomMouseCursor: (Type, Image, Quad) => any;

	/**
		ClearCustomMouseCursor
	
		Removes any override of a system mouse cursor with the given type and defaults to the OS specific mouse cursor.
	
		Type: [string] The system cursor type to remove. This can be one of the following values: 'arrow', 'sizewe', 'sizens', 'sizenesw', 'sizenwse', 'ibeam', 'hand'.
	*/
	ClearCustomMouseCursor: (Type) => any;

	/**
		IsControlHovered
	
		Checks to see if the last control added to the window is hovered by the mouse.
	
		Return: [boolean] True if the last control is hovered, false otherwise.
	*/
	IsControlHovered: () => boolean;

	/**
		IsControlClicked
	
		Checks to see if the previous control is hovered and clicked.
	
		Button: [number] The button to check for. The valid numbers are: 1 - Left, 2 - Right, 3 - Middle.
	
		Return: [boolean] True if the previous control is hovered and clicked. False otherwise.
	*/
	IsControlClicked: (Button) => boolean;

	/**
		GetControlSize
	
		Retrieves the last declared control's size.
	
		Return: [number], [number] The width and height of the last control declared.
	*/
	GetControlSize: () => LuaMultiReturn<[number, number]>;

	/**
		IsVoidHovered
	
		Checks to see if any non-Slab area of the viewport is hovered.
	
		Return: [boolean] True if any non-Slab area of the viewport is hovered. False otherwise.
	*/
	IsVoidHovered: () => boolean;

	/**
		IsVoidClicked
	
		Checks to see if any non-Slab area of the viewport is clicked.
	
		Button: [number] The button to check for. The valid numbers are: 1 - Left, 2 - Right, 3 - Middle.
	
		Return: [boolean] True if any non-Slab area of the viewport is clicked. False otherwise.
	*/
	IsVoidClicked: (Button) => boolean;

	/**
		IsKeyDown
	
		Checks to see if a specific key is held down. The key should be one of the love defined Scancode which the list can
		be found at https://love2d.org/wiki/Scancode.
	
		Key: [string] A love defined key scancode.
	
		Return: [boolean] True if the key is held down. False otherwise.
	*/
	IsKeyDown: (Key) => boolean;

	/**
		IsKeyPressed
	
		Checks to see if a specific key state went from up to down this frame. The key should be one of the love defined Scancode which the list can
		be found at https://love2d.org/wiki/Scancode.
	
		Key: [string] A love defined scancode.
	
		Return: [boolean] True if the key state went from up to down this frame. False otherwise.
	*/
	IsKeyPressed: (Key) => boolean;

	/**
		IsKeyPressed
	
		Checks to see if a specific key state went from down to up this frame. The key should be one of the love defined Scancode which the list can
		be found at https://love2d.org/wiki/Scancode.
	
		Key: [string] A love defined scancode.
	
		Return: [boolean] True if the key state went from down to up this frame. False otherwise.
	*/
	IsKeyReleased: (Key) => boolean;

	/**
		Rectangle
	
		Draws a rectangle at the current cursor position for the active window.
	
		Options: [Table] List of options that control how this rectangle is displayed.
			Mode: [string] Whether this rectangle should be filled or outlined. The default value is 'fill'.
			W: [number] The width of the rectangle.
			H: [number] The height of the rectangle.
			Color: [Table] The color to use for this rectangle.
			Rounding: [number] or [Table]
				[number] Amount of rounding to apply to all corners.
				[Table] Define the rounding for each corner. The order goes top left, top right, bottom right, and bottom left.
			Outline: [boolean] If the Mode option is 'fill', this option will allow an outline to be drawn.
			OutlineColor: [Table] The color to use for the outline if requested.
			Segments: [number] Number of points to add for each corner if rounding is requested.
	
		Return: None.
	*/
	Rectangle: (Options) => void;

	/**
		Circle
	
		Draws a circle at the current cursor position plus the radius for the active window.
	
		Options: [Table] List of options that control how this circle is displayed.
			Mode: [string] Whether this circle should be filled or outlined. The default value is 'fill'.
			Radius: [number] The size of the circle.
			Color: [Table] The color to use for the circle.
			Segments: [number] The number of segments used for drawing the circle.
	
		Return: None.
	*/
	Circle: (Options) => void;

	/**
		Triangle
	
		Draws a triangle at the current cursor position plus the radius for the active window.
	
		Option: [Table] List of options that control how this triangle is displayed.
			Mode: [string] Whether this triangle should be filled or outlined. The default value is 'fill'.
			Radius: [number] The distance from the center of the triangle.
			Rotation: [number] The rotation of the triangle in degrees.
			Color: [Table] The color to use for the triangle.
	
		Return: None.
	*/
	Triangle: (Options) => void;

	/**
		Line
	
		Draws a line starting at the current cursor position and going to the defined points in this function.
	
		X2: [number] The X coordinate for the destination.
		Y2: [number] The Y coordinate for the destination.
		Option: [Table] List of options that control how this line is displayed.
			Width: [number] How thick the line should be.
			Color: [Table] The color to use for the line.
	
		Return: None.
	*/
	Line: (X2, Y2, Options?) => void;

	/**
		Curve
	
		Draws a bezier curve with the given points as control points. The points should be defined in local space. Slab will translate the curve to the
		current cursor position. There should two or more points defined for a proper curve.
	
		Points: [Table] List of points to define the control points of the curve.
		Options: [Table] List of options that control how this curve is displayed.
			Color: [Table] The color to use for this curve.
			Depth: [number] The number of recursive subdivision steps to use when rendering the curve. If nil, the default LÖVE 2D value is used which is 5.
	
		Return: None.
	*/
	Curve: (Points, Options?) => void;

	/**
		GetCurveControlPointCount
	
		Returns the number of control points defined with the last call to Curve.
	
		Return: [number] The number of control points defined for the previous curve.
	*/
	GetCurveControlPointCount: () => number;

	/**
		GetCurveControlPoint
	
		Returns the point for the given control point index. This point by default will be in local space defined by the points given in the Curve function.
		The translated position can be requested by setting the LocalSpace option to false.
	
		Index: [number] The index of the control point to retrieve.
		Options: [Table] A list of options that control what is returned by this function.
			LocalSpace: [boolean] Returns either the translated or untranslated control point. This is true by default.
	
		Return: [number], [number] The translated X, Y coordinates of the given control point.
	*/
	GetCurveControlPoint: (Index, Options?) => LuaMultiReturn<[number, number]>;

	/**
		EvaluateCurve
	
		Returns the point at the given time. The time value should be between 0 and 1 inclusive. The point returned will be in local space. For the translated
		position, set the LocalSpace option to false.
	
		Time: [number] The time on the curve between 0 and 1.
		Options: [Table] A list of options that control what is returned by this function.
			LocalSpace: [boolean] Returnes either the translated or untranslated control point. This is true by default.
	
		Return: [number], [number] The X and Y coordinates at the given time on the curve.
	*/
	EvaluateCurve: (Time, Options?) => LuaMultiReturn<[number, number]>;

	/**
		EvaluateCurveMouse
	
		Returns the point on the curve at the given X-coordinate of the mouse relative to the end points of the curve.
	
		Options: [Table] A list of options that control what is returned by this function.
			Refer to the documentation for EvaluateCurve for the list of options.
	
		Return: [number], [number] The X and Y coordinates at the given X mouse position on the curve.
	*/
	EvaluateCurveMouse: (Options) => LuaMultiReturn<[number, number]>;

	/**
		Polygon
	
		Renders a polygon with the given points. The points should be defined in local space. Slab will translate the position to the current cursor position.
	
		Points: [Table] List of points that define this polygon.
		Options: [Table] List of options that control how this polygon is drawn.
			Color: [Table] The color to render this polygon.
			Mode: [string] Whether to use 'fill' or 'line' to draw this polygon. The default is 'fill'.
	
		Return: None.
	*/
	Polygon: (Points, Options?) => void;

	/**
		BeginStat
	
		Starts the timer for the specific stat in the given category.
	
		Name: [string] The name of the stat to capture.
		Category: [string] The category this stat belongs to.
	
		Return: [number] The handle identifying this stat capture.
	*/
	BeginStat: (Name, Category) => number;

	/**
		EndStat
	
		Ends the timer for the stat assigned to the given handle.
	
		Handle: [number] The handle identifying a BeginStat call.
	
		Return: None.
	*/
	EndStat: (Handle) => void;

	/**
		EnableStats
	
		Sets the enabled state of the stats system. The system is disabled by default.
	
		Enable: [boolean] The new state of the states system.
	
		Return: None.
	*/
	EnableStats: (Enable) => void;

	/**
		IsStatsEnabled
	
		Query whether the stats system is enabled or disabled.
	
		Return: [boolean] Returns whether the stats system is enabled or disabled.
	*/
	IsStatsEnabled: () => boolean;

	/**
		FlushStats
	
		Resets the stats system to an empty state.
	
		Return: None.
	*/
	FlushStats: () => void;

	/**
		BeginLayout
	
		Enables the layout manager and positions the controls between this call and EndLayout based on the given options. The anchor
		position for the layout is determined by the current cursor position on the Y axis. The horizontal position is not anchored.
		Layouts are stacked, so there can be layouts within parent layouts.
	
		Id: [string] The Id of this layout.
		Options: [Table] List of options that control how this layout behaves.
			AlignX: [string] Defines how the controls should be positioned horizontally in the window. The available options are
				'left', 'center', or 'right'. The default option is 'left'.
			AlignY: [string] Defines how the controls should be positioned vertically in the window. The available options are
				'top', 'center', or 'bottom'. The default option is 'top'. The top is determined by the current cursor position.
			AlignRowY: [string] Defines how the controls should be positioned vertically within a row. The available options are
				'top', 'center', or 'bottom'. The default option is 'top'.
			Ignore: [boolean] Should this layout ignore positioning of controls. This is useful if certain controls need custom
				positioning within a layout.
			ExpandW: [boolean] If true, will expand all controls' width within the row to the size of the window.
			ExpandH: [boolean] If true, will expand all controls' height within the row and the size of the window.
			AnchorX: [boolean] Anchors the layout management at the current X cursor position. The size is calculated using this position.
				The default value for this is false.
			AnchorY: [boolean] Anchors the layout management at the current Y cursor position. The size is calculated using this position.
				The default value for this is true.
			Columns: [number] The number of columns to use for this layout. The default value is 1.
	
		Return: None.
	*/
	BeginLayout: (Id, Options?) => void;

	/**
		EndLayout
	
		Ends the currently active layout. Each BeginLayout call must have a matching EndLayout. Failure to do so will result in
		an assertion.
	
		Return: None.
	*/
	EndLayout: () => void;

	/**
		SetLayoutColumn
	
		Sets the current active column.
	
		Index: [number] The index of the column to be active.
	
		Return: None.
	*/
	SetLayoutColumn: (Index) => void;

	/**
		GetLayoutSize
	
		Retrieves the size of the active layout. If there are columns, then the size of the column is returned.
	
		Return: [number], [number] The width and height of the active layout. 0 is returned if no layout is active.
	*/
	GetLayoutSize: () => LuaMultiReturn<[number, number]>;

	/**
		GetCurrentColumnIndex
	
		Retrieves the current index of the active column.
	
		Return: [number] The current index of the active column of the active layout. 0 is returned if no layout or column is active.
	*/
	GetCurrentColumnIndex: () => number;

	/**
		SetScrollSpeed
	
		Sets the speed of scrolling when using the mouse wheel.
	
		Return: None.
	*/
	SetScrollSpeed: (Speed) => void;

	/**
		GetScrollSpeed
	
		Retrieves the speed of scrolling for the mouse wheel.
	
		Return: [number] The current wheel scroll speed.
	*/
	GetScrollSpeed: () => number;

	/**
		PushShader
	
		Pushes a shader effect to be applied to any following controls before a call to PopShader. Any shader effect that is still active
		will be cleared at the end of Slab's draw call.
	
		Shader: [Object] The shader object created with the love.graphics.newShader function. This object should be managed by the caller.
	
		Return: None.
	*/
	PushShader: (Shader) => void;

	/**
		PopShader
	
		Pops the currently active shader effect. Will enable the next active shader on the stack. If none exists, no shader is applied.
	
		Return: None.
	*/
	PopShader: () => void;

	/**
		EnableDocks
	
		Enables the docking functionality for a particular side of the viewport.
	
		List: [String/Table] A single item or list of items to enable for docking. The valid options are 'Left', 'Right', or 'Bottom'.
	
		Return: None.
	*/
	EnableDocks: (List) => void;

	/**
		DisableDocks
	
		Disables the docking functionality for a particular side of the viewport.
	
		List: [String/Table] A single item or list of items to disable for docking. The valid options are 'Left', 'Right', or 'Bottom'.
	
		Return: None.
	*/
	DisableDocks: (List) => void;

	/**
		SetDockOptions
	
		Set options for a dock type.
	
		Type: [string] The type of dock to set options for. This can be 'Left', 'Right', or 'Bottom'.
		Options: [Table] List of options that control how a dock behaves.
			NoSavedSettings: [boolean] Flag to disable saving a dock's settings to the state INI file.
	*/
	SetDockOptions: (Type, Options?) => any;

	/**
		WindowToDoc
	
		Programatically set a window to dock.
	
		Type: [string] The type of dock to set options for. This can be 'Left', 'Right', or 'Bottom'.
	*/
	WindowToDock: (Type) => any;
}