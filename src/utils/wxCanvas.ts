import { strLen } from '.';

interface ICtx {
    ctx: WXContext;
}

interface IShadow {
    shadow: {
        offsetX?: number;
        offsetY?: number;
        blur: number;
        color: string;
    };
}

interface IFillStyle {
    color: string;
}

interface IFontSize {
    fontSize: number;
}

interface ITextAlign {
    align: string;
}
interface IRect {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface IArc {
    x: number;
    y: number;
    r: number;
    startAngle?: number;
    sweepAngle?: number;
}

interface IDottedLine {
    margin: number;
}
interface IImage {
    imageResource: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

interface IText {
    text: string;
    x: number;
    y: number;
}

interface IStrongText {
    strongText: {
        text: string;
        color: string;
        fontSize: number;
    };
}

interface ITextBaseLine {
    baseline: string;
}

interface IBold {
    isBold: boolean;
}

interface ITextWidthWrap {
    maxWidth: number;
    maxLine: number;
    lineHeight: number;
}

interface IHalfMode {
    isHalfMode: boolean;
}

export function setShadow<T extends ICtx & IShadow>(options: T) {
    const { ctx, shadow } = options;
    ctx.setShadow(0, 0, shadow.blur, shadow.color);
}

// 绘制背景底色
export function drawBaseBackground<T extends ICtx & IFillStyle & IRect>(options: T) {
    const { ctx, color, x, y, width, height } = options;
    ctx.save();
    ctx.beginPath();
    ctx.setFillStyle(color);
    ctx.fillRect(x, y, width, height);
    ctx.restore();
}

// 绘制圆
export function drawCircle<T extends ICtx & IFillStyle & IArc & IShadow>(options: T) {
    const { ctx, color, r, x, y, shadow } = options;

    ctx.save();

    if (shadow) {
        ctx.setShadow(0, 0, shadow.blur, shadow.color);
    }

    ctx.setFillStyle(color);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();

    if (shadow) {
        ctx.setShadow(0, 0, 0, shadow.color);
    }
}

// 绘制头像<T extends ICtx & IArc & IImage>
export function drawCircleImage(options: any) {
    const { ctx, imageResource, r, x, y, color, shadow } = options;

    ctx.save();

    if (shadow) {
        ctx.setShadow(0, 0, shadow.blur, shadow.color);
    }

    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.setFillStyle(color);
    ctx.fill();
    ctx.clip();
    ctx.drawImage(imageResource, x - r, y - r, r * 2, r * 2);
    ctx.restore();
}

// 绘制矩形图片
export function drawRectImage<T extends ICtx & IImage>(options: T) {
    const { ctx, imageResource, width, height, x, y } = options;
    ctx.save();
    ctx.drawImage(imageResource, x, y, width, height);
    ctx.restore();
}

// 绘制字体
export function fillText<T extends ICtx & IFillStyle & IText & IFontSize & ITextAlign & ITextBaseLine & IBold>(options: T) {
    const { ctx, text, fontSize, color, x, y, align, baseline, isBold } = options;

    if (isBold) {
        ctx.font = 'bold 32px PingFang SC';
    } else {
        ctx.font = '32px PingFang SC UltraLight';
    }

    ctx.setTextAlign(align);
    ctx.setFillStyle(color);
    ctx.setTextBaseline(baseline || 'middle');
    ctx.setFontSize(fontSize);
    ctx.fillText(text, x, y);
}

function toLine(str: string, maxChar: number): string[] {
    const dict: number[] = [];
    let count = 0;

    for (let i = 0, len = str.length; i < len; i++) {
        if (count >= maxChar) {
            dict.push(i - 1);
            count = 0;
        }
        count += str.charCodeAt(i) < 256 ? 1 : 2;
    }

    if (dict.length > 0) {
        return dict.map((v, i) => {
            return i === 0
                ? str.slice(0, v)
                : str.slice(dict[i - 1], v);
        }).concat(str.slice(dict[dict.length - 1]));
    } else {
        return [str];
    }
}

// 自动换行并根据配置截取文段后 绘制字体
export function fillTextWidthWrap<T extends ICtx & ITextAlign & IFillStyle & ITextBaseLine & IFontSize & IText & IBold & ITextWidthWrap>(options: T) {
    let isEllipse: boolean;
    const { ctx, text, fontSize, color, x, y, align, baseline, isBold, maxWidth, maxLine, lineHeight } = options;

    if (isBold) {
        ctx.font = 'bold 32px PingFang SC';
    } else {
        ctx.font = '32px PingFang SC UltraLight';
    }

    ctx.setTextAlign(align);
    ctx.setFillStyle(color);
    ctx.setTextBaseline(baseline || 'middle');
    ctx.setFontSize(fontSize);

    // single char length
    const CHAR = ctx.measureText('一').width / 2;

    // single line has chars length
    const CHAR_AMOUNT_INLINE = Math.floor(maxWidth / CHAR);

    // text in wrap
    const originTextList = text.split('\n');
    const textList = originTextList.slice(0, maxLine);

    if (originTextList.length > maxLine) {
        isEllipse = true;
    }

    let canvasContentList: string[] = [];

    textList.forEach((paragraph: string) => {
        canvasContentList = canvasContentList.concat(toLine(paragraph, CHAR_AMOUNT_INLINE));
    });
    if (canvasContentList.length > maxLine) {
        isEllipse = true;
    }

    canvasContentList = canvasContentList.slice(0, maxLine);
    canvasContentList.forEach((val, index) => {
        const res = isEllipse && canvasContentList.length - 1 === index
            ? `${val}...`
            : val;

        ctx.fillText(res, x, y + index * (fontSize + lineHeight));
    });
}

// 目前只考虑 加重字段在 文本中，不考虑在头|尾的情况
export function fillTextWidthStrongStyle<T extends ICtx & IFillStyle & IText & IFontSize & ITextAlign & ITextBaseLine & IBold & IStrongText>(options: T) {
    const { ctx, text, fontSize, color, x, y, align, baseline, isBold, strongText } = options;

    if (isBold) {
        ctx.font = 'bold 32px PingFang SC';
    } else {
        ctx.font = '32px PingFang SC UltraLight';
    }

    if (strongText && ~text.indexOf(strongText.text)) {
        ctx.setFontSize(strongText.fontSize);
        const strongChar = ctx.measureText('一').width / 2;
        const strongW = strLen(strongText.text) * strongChar;

        const simpeTextList = text.split(strongText.text);

        ctx.setFontSize(fontSize);
        const leftChar = ctx.measureText(simpeTextList[0]).width / 2;
        const leftstrongW = strLen(simpeTextList[0]) * leftChar;

        fillText(Object.assign({}, options, {
            text: simpeTextList[0],
            align
        }));

        fillText(Object.assign({}, options, {
            text: simpeTextList[1],
            x: +leftstrongW + strongW - 8,
            align
        }));

        fillText(Object.assign({}, options, {
            ...options.strongText,
            x: +leftstrongW - 25,
            align
        }));

    }
}

// 圆角矩形
export function drawRoundedRect<T extends ICtx & IArc & IRect & IFillStyle & IShadow | ICtx & IArc & IRect & IFillStyle>(options: T) {
    // @ts-ignore
    const { ctx, x, y, r, width, height, color, shadow } = options;

    ctx.save();

    if (shadow) {
        ctx.setShadow(0, 0, shadow.blur, shadow.color);
    }

    ctx.beginPath();
    ctx.moveTo(x, y + r);
    ctx.lineTo(x, y + height - r);
    ctx.quadraticCurveTo(x, y + height, x + r, y + height);
    ctx.lineTo(x + width - r, y + height);
    ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - r);
    ctx.lineTo(x + width, y + r);
    ctx.quadraticCurveTo(x + width, y, x + width - r, y);
    ctx.lineTo(x + r, y);
    ctx.quadraticCurveTo(x, y, x, y + r);
    ctx.setFillStyle(color);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

// 圆角矩形Path
export function drawRoundedRectPath<T extends ICtx & IArc & IRect & IHalfMode>(options: T) {
    const { ctx, x, y, r, width, height, isHalfMode } = options;
    ctx.beginPath();

    // 仅圆角左侧
    if (isHalfMode) {
        ctx.moveTo(x + width, y + height);
    } else {
        // 从右下角顺时针绘制，弧度从0到1/2PI
        ctx.arc(x + width - r, y + height - r, r, 0, Math.PI / 2);
    }

    // 矩形下边线
    ctx.lineTo(x + r, y + height);

    // 左下角圆弧，弧度从1/2PI到PI
    ctx.arc(x + r, y + height - r, r, Math.PI / 2, Math.PI);

    // 矩形左边线
    ctx.lineTo(x, y + r);

    // 左上角圆弧，弧度从PI到3/2PI
    ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 3 / 2);

    if (isHalfMode) {
        // 上边线
        ctx.lineTo(x + width, y);

        // 右上角
        ctx.lineTo(x + width, y + r);
    } else {
        // 上边线
        ctx.lineTo(x + width - r, y);

        // 右上角圆弧
        ctx.arc(x + width - r, y + r, r, Math.PI * 3 / 2, Math.PI * 2);
    }

    // 右边线
    ctx.lineTo(x + width, y + height - r);
    ctx.clip();
    ctx.closePath();
}

// 圆点
export function drawdottedLine<T extends ICtx & IArc & IRect & IDottedLine & IFillStyle>(options: T) {
    const { ctx, x, y, r, width, margin, color } = options;
    for (let i = 0; i < Math.floor(width / ((r + margin) * 2)); i++) {
        drawCircle({
            ctx,
            color: '#FFE6E1',
            r,
            x: x + ((r + margin) * 2) * i,
            y,
            shadow: {
                blur: 0,
                color: '#FFE6E1'
            }
        });
    }
}
