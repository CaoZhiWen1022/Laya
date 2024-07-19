import { LayOutSystem } from "../../LayOutSystem/LayOutSystem";

export class ExtendsGuiList {
    static init() {
        Object.defineProperties(fgui.GList.prototype, {
            setLayOut: {
                value: function (value: number) {
                    const t = this;
                    let a = 0;
                    if (value <= 5) {
                        t.layout = value;
                    } else {
                        t._children.forEach((element, index) => {
                            const [x, y] = LayOutSystem.instance.getLayOut(value, index);
                            element.x = x;
                            element.y = y;
                        });
                    }
                },
                enumerable: false
            },
            updateBounds: {
                value: function (value: number) {

                    if (this._virtual)
                        return;
                    var i;
                    var child;
                    var curX = 0;
                    var curY = 0;
                    var maxWidth = 0;
                    var maxHeight = 0;
                    var cw, ch;
                    var j = 0;
                    var page = 0;
                    var k = 0;
                    var cnt = this._children.length;
                    var viewWidth = this.viewWidth;
                    var viewHeight = this.viewHeight;
                    var lineSize = 0;
                    var lineStart = 0;
                    var ratio;
                    if (this._layout == fgui.ListLayoutType.SingleColumn) {
                        for (i = 0; i < cnt; i++) {
                            child = this.getChildAt(i);
                            if (this.foldInvisibleItems && !child.visible)
                                continue;
                            if (curY != 0)
                                curY += this._lineGap;
                            child.y = curY;
                            if (this._autoResizeItem)
                                child.setSize(viewWidth, child.height, true);
                            curY += Math.ceil(child.height);
                            if (child.width > maxWidth)
                                maxWidth = child.width;
                        }
                        ch = curY;
                        if (ch <= viewHeight && this._autoResizeItem && this._scrollPane && this._scrollPane._displayInDemand && this._scrollPane.vtScrollBar) {
                            viewWidth += this._scrollPane.vtScrollBar.width;
                            for (i = 0; i < cnt; i++) {
                                child = this.getChildAt(i);
                                if (this.foldInvisibleItems && !child.visible)
                                    continue;
                                child.setSize(viewWidth, child.height, true);
                                if (child.width > maxWidth)
                                    maxWidth = child.width;
                            }
                        }
                        cw = Math.ceil(maxWidth);
                    }
                    else if (this._layout == fgui.ListLayoutType.SingleRow) {
                        for (i = 0; i < cnt; i++) {
                            child = this.getChildAt(i);
                            if (this.foldInvisibleItems && !child.visible)
                                continue;
                            if (curX != 0)
                                curX += this._columnGap;
                            child.x = curX;
                            if (this._autoResizeItem)
                                child.setSize(child.width, viewHeight, true);
                            curX += Math.ceil(child.width);
                            if (child.height > maxHeight)
                                maxHeight = child.height;
                        }
                        cw = curX;
                        if (cw <= viewWidth && this._autoResizeItem && this._scrollPane && this._scrollPane._displayInDemand && this._scrollPane.hzScrollBar) {
                            viewHeight += this._scrollPane.hzScrollBar.height;
                            for (i = 0; i < cnt; i++) {
                                child = this.getChildAt(i);
                                if (this.foldInvisibleItems && !child.visible)
                                    continue;
                                child.setSize(child.width, viewHeight, true);
                                if (child.height > maxHeight)
                                    maxHeight = child.height;
                            }
                        }
                        ch = Math.ceil(maxHeight);
                    }
                    else if (this._layout == fgui.ListLayoutType.FlowHorizontal) {
                        if (this._autoResizeItem && this._columnCount > 0) {
                            for (i = 0; i < cnt; i++) {
                                child = this.getChildAt(i);
                                if (this.foldInvisibleItems && !child.visible)
                                    continue;
                                lineSize += child.sourceWidth;
                                j++;
                                if (j == this._columnCount || i == cnt - 1) {
                                    ratio = (viewWidth - lineSize - (j - 1) * this._columnGap) / lineSize;
                                    curX = 0;
                                    for (j = lineStart; j <= i; j++) {
                                        child = this.getChildAt(j);
                                        if (this.foldInvisibleItems && !child.visible)
                                            continue;
                                        child.setXY(curX, curY);
                                        if (j < i) {
                                            child.setSize(child.sourceWidth + Math.round(child.sourceWidth * ratio), child.height, true);
                                            curX += Math.ceil(child.width) + this._columnGap;
                                        }
                                        else {
                                            child.setSize(viewWidth - curX, child.height, true);
                                        }
                                        if (child.height > maxHeight)
                                            maxHeight = child.height;
                                    }
                                    //new line
                                    curY += Math.ceil(maxHeight) + this._lineGap;
                                    maxHeight = 0;
                                    j = 0;
                                    lineStart = i + 1;
                                    lineSize = 0;
                                }
                            }
                            ch = curY + Math.ceil(maxHeight);
                            cw = viewWidth;
                        }
                        else {
                            for (i = 0; i < cnt; i++) {
                                child = this.getChildAt(i);
                                if (this.foldInvisibleItems && !child.visible)
                                    continue;
                                if (curX != 0)
                                    curX += this._columnGap;
                                if (this._columnCount != 0 && j >= this._columnCount
                                    || this._columnCount == 0 && curX + child.width > viewWidth && maxHeight != 0) {
                                    //new line
                                    curX = 0;
                                    curY += Math.ceil(maxHeight) + this._lineGap;
                                    maxHeight = 0;
                                    j = 0;
                                }
                                child.setXY(curX, curY);
                                curX += Math.ceil(child.width);
                                if (curX > maxWidth)
                                    maxWidth = curX;
                                if (child.height > maxHeight)
                                    maxHeight = child.height;
                                j++;
                            }
                            ch = curY + Math.ceil(maxHeight);
                            cw = Math.ceil(maxWidth);
                        }
                    }
                    else if (this._layout == fgui.ListLayoutType.FlowVertical) {
                        if (this._autoResizeItem && this._lineCount > 0) {
                            for (i = 0; i < cnt; i++) {
                                child = this.getChildAt(i);
                                if (this.foldInvisibleItems && !child.visible)
                                    continue;
                                lineSize += child.sourceHeight;
                                j++;
                                if (j == this._lineCount || i == cnt - 1) {
                                    ratio = (viewHeight - lineSize - (j - 1) * this._lineGap) / lineSize;
                                    curY = 0;
                                    for (j = lineStart; j <= i; j++) {
                                        child = this.getChildAt(j);
                                        if (this.foldInvisibleItems && !child.visible)
                                            continue;
                                        child.setXY(curX, curY);
                                        if (j < i) {
                                            child.setSize(child.width, child.sourceHeight + Math.round(child.sourceHeight * ratio), true);
                                            curY += Math.ceil(child.height) + this._lineGap;
                                        }
                                        else {
                                            child.setSize(child.width, viewHeight - curY, true);
                                        }
                                        if (child.width > maxWidth)
                                            maxWidth = child.width;
                                    }
                                    //new line
                                    curX += Math.ceil(maxWidth) + this._columnGap;
                                    maxWidth = 0;
                                    j = 0;
                                    lineStart = i + 1;
                                    lineSize = 0;
                                }
                            }
                            cw = curX + Math.ceil(maxWidth);
                            ch = viewHeight;
                        }
                        else {
                            for (i = 0; i < cnt; i++) {
                                child = this.getChildAt(i);
                                if (this.foldInvisibleItems && !child.visible)
                                    continue;
                                if (curY != 0)
                                    curY += this._lineGap;
                                if (this._lineCount != 0 && j >= this._lineCount
                                    || this._lineCount == 0 && curY + child.height > viewHeight && maxWidth != 0) {
                                    curY = 0;
                                    curX += Math.ceil(maxWidth) + this._columnGap;
                                    maxWidth = 0;
                                    j = 0;
                                }
                                child.setXY(curX, curY);
                                curY += Math.ceil(child.height);
                                if (curY > maxHeight)
                                    maxHeight = curY;
                                if (child.width > maxWidth)
                                    maxWidth = child.width;
                                j++;
                            }
                            cw = curX + Math.ceil(maxWidth);
                            ch = Math.ceil(maxHeight);
                        }
                    }
                    else //pagination
                    {
                        var eachHeight;
                        if (this._autoResizeItem && this._lineCount > 0)
                            eachHeight = Math.floor((viewHeight - (this._lineCount - 1) * this._lineGap) / this._lineCount);
                        if (this._autoResizeItem && this._columnCount > 0) {
                            for (i = 0; i < cnt; i++) {
                                child = this.getChildAt(i);
                                if (this.foldInvisibleItems && !child.visible)
                                    continue;
                                if (j == 0 && (this._lineCount != 0 && k >= this._lineCount
                                    || this._lineCount == 0 && curY + child.height > viewHeight)) {
                                    //new page
                                    page++;
                                    curY = 0;
                                    k = 0;
                                }
                                lineSize += child.sourceWidth;
                                j++;
                                if (j == this._columnCount || i == cnt - 1) {
                                    ratio = (viewWidth - lineSize - (j - 1) * this._columnGap) / lineSize;
                                    curX = 0;
                                    for (j = lineStart; j <= i; j++) {
                                        child = this.getChildAt(j);
                                        if (this.foldInvisibleItems && !child.visible)
                                            continue;
                                        child.setXY(page * viewWidth + curX, curY);
                                        if (j < i) {
                                            child.setSize(child.sourceWidth + Math.round(child.sourceWidth * ratio), this._lineCount > 0 ? eachHeight : child.height, true);
                                            curX += Math.ceil(child.width) + this._columnGap;
                                        }
                                        else {
                                            child.setSize(viewWidth - curX, this._lineCount > 0 ? eachHeight : child.height, true);
                                        }
                                        if (child.height > maxHeight)
                                            maxHeight = child.height;
                                    }
                                    //new line
                                    curY += Math.ceil(maxHeight) + this._lineGap;
                                    maxHeight = 0;
                                    j = 0;
                                    lineStart = i + 1;
                                    lineSize = 0;
                                    k++;
                                }
                            }
                        }
                        else {
                            for (i = 0; i < cnt; i++) {
                                child = this.getChildAt(i);
                                if (this.foldInvisibleItems && !child.visible)
                                    continue;
                                if (curX != 0)
                                    curX += this._columnGap;
                                if (this._autoResizeItem && this._lineCount > 0)
                                    child.setSize(child.width, eachHeight, true);
                                if (this._columnCount != 0 && j >= this._columnCount
                                    || this._columnCount == 0 && curX + child.width > viewWidth && maxHeight != 0) {
                                    //new line
                                    curX = 0;
                                    curY += Math.ceil(maxHeight) + this._lineGap;
                                    maxHeight = 0;
                                    j = 0;
                                    k++;
                                    if (this._lineCount != 0 && k >= this._lineCount
                                        || this._lineCount == 0 && curY + child.height > viewHeight && maxWidth != 0) //new page
                                    {
                                        page++;
                                        curY = 0;
                                        k = 0;
                                    }
                                }
                                const [x, y] = LayOutSystem.instance.getLayOut(this._layout, i);
                                // child.setXY(page * viewWidth + curX, curY);
                                child.setXY(x, y);
                                curX += Math.ceil(child.width);
                                if (curX > maxWidth)
                                    maxWidth = curX;
                                if (child.height > maxHeight)
                                    maxHeight = child.height;
                                j++;
                            }
                        }
                        ch = page > 0 ? viewHeight : curY + Math.ceil(maxHeight);
                        cw = (page + 1) * viewWidth;
                    }
                    this.handleAlign(cw, ch);
                    this.setBounds(0, 0, cw, ch);
                }
            }
        });
    }
}