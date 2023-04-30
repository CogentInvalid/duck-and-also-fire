import { Font } from "love.graphics";

export class TextUnit {
	public character: string;
	public operation?: string;
	public wait: boolean;
	public constructor(character: string, wait: boolean, operation?: string) {
        this.character = character;
        this.operation = operation;
        this.wait = wait;
    }
    
    public get opName(): string {
        return this.operation.split("=")[0];
    }

    public get opArg(): string {
        let split = this.operation.split("=");
        if (split.length > 1) return split[1];
        else return null;
    }
}

export class TextProcessor {

    static process(str: string, font: Font, wrapWidth: number): TextUnit[] {
        let text = str.split("");
        let units: TextUnit[] = [];

		let lastSpace = -1;
        let line = "";

        for (let i = 0; i < text.length; i++) {
            let c = text[i];
            if (c == "<") {
                i += this.processTag(text, i, units);
            }
            else {
                if (c == "\n") line = "";
                if (c == " ") lastSpace = units.length;
    
                units.push(new TextUnit(c, c != "\n"));
    
                let lineWidth = font.getWidth(line + c);
                if (lineWidth > wrapWidth) {
                    if (lastSpace != -1) {
                        units[lastSpace] = new TextUnit("\n", false);
                        line = "";
                        for (let j = lastSpace + 1; j < units.length; j++) {
                            line += units[j].character;
                        }
                        lastSpace = -1;
                    }
                    else {
                        units.push(new TextUnit("\n", false));
                        line = "";
                    }
                }
                else {
                    line += c;
                }
            }
        }

        return units;
    }

    static getString(text: TextUnit[]): string {
        let str = "";
        for (let i = 0; i < text.length; i++) {
            let unit = text[i];
            if (!unit.operation) {
                str += unit.character;
            }
        }
        return str;
    }

    static print(text: TextUnit[]) {
        let str = "";
        for (let i = 0; i < text.length; i++) {
            str += "[";
            let unit = text[i];
            if (unit.operation) {
                str += "<" + unit.operation + ">";
            }
            else {
                str += unit.character;
            }
            str += "]";
        }
        print(str);
    }

    // Add a TextUnit with the correct operation to the list and return
    // the number of characters to skip to get to the end of the tag.
    static processTag(text: string[], start: number, list: TextUnit[]): number {
        let tag = "";
        for (let i = start + 1; text[i] != ">"; i++) {
            tag += text[i];
        }
        list.push(new TextUnit("", false, tag));
        return tag.length + 1;
    }

}
