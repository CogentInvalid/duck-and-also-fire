import { Font, Image } from "love.graphics";
import { Scancode } from "love.keyboard";

export namespace LoveFrames {
	type Object = BaseObject;

	type Panel = BaseObject;
	type List = BaseObject;
	
	type ParentObject = Frame | Panel | List;
	
	type BaseObject = {
		x: number;
		y: number;
	
		SetPos: (x: number, y: number, center?: boolean) => void;
		SetX: (x: number, center?: boolean) => void;
		SetY: (y: number, center?: boolean) => void;
		GetPos: () => LuaMultiReturn<[number, number]>;
		GetX: () => number;
		GetY: () => number;
		GetStaticPosition: () => LuaMultiReturn<[number, number]>;
		GetStaticX: () => number;
		GetStaticY: () => number;
		Center: () => void;
		CenterX: () => void;
		CenterY: () => void;
		SetSize: (width: number, height: number) => void;
		SetWidth: (width: number) => void;
		SetHeight: (height: number) => void;
		GetSize: () => LuaMultiReturn<[number, number]>;
		GetWidth: () => number;
		GetHeight: () => number;
		SetVisible: (visible: boolean) => void;
		GetVisible: () => boolean;
		SetParent: (parent: ParentObject) => void;
		GetParent: () => ParentObject;
		Remove: () => void;
		SetClickBounds: (x: number, y: number, width: number, height: number) => void;
		GetClickBounds: () => Rect;
		RemoveClickBounds: () => void;
		IsTopCollision: () => boolean;
		GetBaseParent: () => Object;
		GetHover: () => boolean;
		GetChildren: () => Object[];
		GetInternals: () => Object[];
		GetType: () => string;
		GetParents: () => ParentObject[];
		// IsTopList
		// IsTopChild
		// MoveToTop
		// SetSkin
		// GetSkin
		// GetSkinName
		// SetAlwaysUpdate
		// GetAlwaysUpdate
		// SetRetainSize
		// GetRetainSize
		// IsActive
		// IsTopInternal
		// IsInternal
		// SetDrawOrder
		// GetDrawOrder
		// SetProperty
		// GetProperty
		// CenterWithinArea
		// IsInList
		// SetState
		// GetState
	}

	type Frame = BaseObject & {
		OnClose: (object?: Frame) => void;
		OnDock: (object: Frame, dock_object: Object) => void;
		SetName: (name: string) => void;
		GetName: () => string;
		SetDraggable: (draggable: boolean) => void;
		GetDraggable: () => boolean;
		SetScreenLocked: (screenlocked: boolean) => void;
		GetScreenLocked: () => boolean;
		ShowCloseButton: (show: boolean) => void;
		MakeTop: () => void;
		SetModal: (modal: boolean) => void;
		GetModal: () => boolean;
		// SetParentLocked
		// GetParentLocked
		SetIcon: (icon: string | Image) => void;
		GetIcon: () => string | Image;
		// SetDockable
		// GetDockable
		// SetDockZoneSize
	}
	
	type Button = BaseObject & {
		OnClick: (object: Button, x: number, y: number) => void;
		SetText: (text: string) => void;
		GetText: () => string;
		SetClickable: (clickable: boolean) => void;
		GetClickable: () => boolean;
		SetEnabled: (enabled: boolean) => void;
		GetEnabled: () => boolean;
		SetFont: (font: Font) => void;
		GetFont: () => Font;
	}

	type Text = BaseObject & {
		SetText: (text: string | number | object) => void;
		GetText: () => string;
		GetFormattedText: () => object;
		SetMaxWidth: (width: number) => void;
		GetMaxWidth: () => number;
		SetFont: (font: Font) => void;
		GetFont: () => Font;
		GetLines: () => number;
		// SetIgnoreNewlines
		// GetIgnoreNewlines
		// SetShadow
		// GetShadow
		// SetShadowOffsets
		// GetShadowOffsets
		// SetShadowColor
		// GetShadowColor
		SetDefaultColor: (r: number, g: number, b: number, a: number) => void;
		GetDefaultColor: () => {r: number, g: number, b: number, a: number};
	}
	
	type ObjectType = "button" | "checkbox" | "collapsiblecategory" | "columnlist" | "frame" | "grid" | "image" | "imagebutton" |
		"list" | "multichoice" | "numberbox" | "panel" | "progressbar" | "slider" | "tabs" | "text" | "textinput" | "tooltip"
	
	/** @noSelf **/
	interface LoveFrames {
		update: (dt: number) => void;
		draw: () => void;
		mousepressed: (x: number, y: number, button: number) => void;
		mousereleased: (x: number, y: number, button: number) => void;
		keypressed: (key: Scancode, isrepeat: boolean) => void;
		keyreleased: (key: Scancode) => void;
		textinput: (text: string) => void;
	
		Create: (type: ObjectType) => Object;
	}
}