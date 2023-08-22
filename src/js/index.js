class DrawingBoard {
  MODE = "NONE"; //NONE | BRUSH | ERASER
  IsMouseDown = false;
  backgroundColor = "#FFFFFF";
  undoArray = [];
  containerEl;
  canvasEl;
  toolbarEl;
  bruesEl;
  colorPickerEl;
  brushSliderEl;
  brushSizePreviewEl;
  eraserEl;
  navigatorImageEl;
  undoEl;
  clearEl;
  downloadEl;
  constructor() {
    this.assingElement();
    this.initContext();
    this.initCanvasBackgroundColor();
    this.addEvent();
  }
  assingElement() {
    this.containerEl = document.getElementById("container");
    this.canvasEl = this.containerEl.querySelector("#canvas");
    this.toolbarEl = this.containerEl.querySelector("#toolbar");
    this.bruesEl = this.toolbarEl.querySelector("#brush");
    this.colorPickerEl = this.toolbarEl.querySelector("#colorPicker");
    this.brushPanelEl = this.containerEl.querySelector("#brushPanel");
    this.brushSliderEl = this.brushPanelEl.querySelector("#brushSize");
    this.brushSizePreviewEl =
      this.brushPanelEl.querySelector("#brushSizePreview");
    this.eraserEl = this.toolbarEl.querySelector("#eraser");
    this.navigatorImageEl = this.containerEl.querySelector("#canvasImg");
    this.undoEl = this.toolbarEl.querySelector("#undo");
    this.clearEl = this.toolbarEl.querySelector("#clear");
    this.downloadEl = this.toolbarEl.querySelector("#download");
  }
  initContext() {
    this.context = this.canvasEl.getContext("2d");
  }
  initCanvasBackgroundColor() {
    this.context.fillStyle = this.backgroundColor;
    this.context.fillRect(0, 0, this.canvasEl.width, this.canvasEl.height);
  }
  addEvent() {
    this.bruesEl.addEventListener("click", this.onClickBrush.bind(this));
    this.canvasEl.addEventListener("mousedown", this.onMouseDown.bind(this));
    this.canvasEl.addEventListener("mousemove", this.onMouseMove.bind(this));
    this.canvasEl.addEventListener("mouseup", this.onMouseUp.bind(this));
    this.canvasEl.addEventListener("mouseout", this.onMouseOut.bind(this));
    this.brushSliderEl.addEventListener(
      "input",
      this.onChangeBrushSize.bind(this)
    );
    this.colorPickerEl.addEventListener("input", this.onChangeColor.bind(this));
    this.eraserEl.addEventListener("click", this.onClickEraser.bind(this));
    this.undoEl.addEventListener("click", this.onClickUndo.bind(this));
    this.clearEl.addEventListener("click", this.onClickClear.bind(this));
    this.downloadEl.addEventListener("click", this.onClickDownload.bind(this));
  }
  saveState() {
    this.undoArray.push(this.canvasEl.toDataURL());
  }
  onClickDownload(event) {
    this.downloadEl.href = this.canvasEl.toDataURL("image/jpeg", 1);
    this.downloadEl.download = "drawing.jpeg";
  }
  onClickClear(event) {
    this.context.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
    this.undoArray = [];
    this.updateNavigator();
    this.initCanvasBackgroundColor();
  }
  onClickUndo(event) {
    if (this.undoArray.length === 0) return;
    let prevDataUrl = this.undoArray.pop();
    let prevImage = new Image();
    prevImage.onload = () => {
      this.context.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
      this.context.drawImage(
        prevImage,
        0,
        0,
        this.canvasEl.width,
        this.canvasEl.height,
        0,
        0,
        this.canvasEl.width,
        this.canvasEl.height
      );
    };
    prevImage.src = prevDataUrl;
  }
  updateNavigator() {
    this.navigatorImageEl.src = this.canvasEl.toDataURL();
  }
  onMouseOut(event) {
    if (this.MODE === "NONE") return;
    this.IsMouseDown = false;
    this.updateNavigator();
  }
  onChangeColor(event) {
    this.brushSizePreviewEl.style.background = event.target.value;
  }
  onChangeBrushSize(event) {
    this.brushSizePreviewEl.style.width = `${event.target.value}px`;
    this.brushSizePreviewEl.style.height = `${event.target.value}px`;
  }
  onMouseUp(event) {
    if (this.MODE === "NONE") return;
    this.IsMouseDown = false;
    this.updateNavigator();
  }
  onMouseMove(event) {
    if (!this.IsMouseDown) return;
    const currentPosition = this.getMousePosition(event);
    this.context.lineTo(currentPosition.x, currentPosition.y);
    this.context.stroke();
  }
  onMouseDown(event) {
    if (this.MODE === "NONE") return;
    this.IsMouseDown = true;
    const currentPosition = this.getMousePosition(event);
    this.context.beginPath();
    this.context.moveTo(currentPosition.x, currentPosition.y);
    this.context.lineCap = "round";
    if (this.MODE === "BRUSH") {
      this.context.strokeStyle = this.colorPickerEl.value;
      this.context.lineWidth = this.brushSliderEl.value;
    } else if (this.MODE === "ERASER") {
      this.context.strokeStyle = this.backgroundColor;
      this.context.lineWidth = this.brushSliderEl.value;
    }
    this.saveState();
  }
  getMousePosition(event) {
    const boundaries = this.canvasEl.getBoundingClientRect();
    return {
      x: event.clientX - boundaries.left,
      y: event.clientY - boundaries.top,
    };
  }
  onClickBrush(event) {
    const IsActive = event.currentTarget.classList.contains("active");
    this.MODE = IsActive ? "NONE" : "BRUSH";
    this.canvasEl.style.cursor = IsActive ? "default" : "crosshair";
    this.bruesEl.classList.toggle("active");
    this.eraserEl.classList.remove("active");
  }
  onClickEraser(event) {
    const IsActive = event.currentTarget.classList.contains("active");
    this.MODE = IsActive ? "NONE" : "ERASER";
    this.canvasEl.style.cursor = IsActive ? "default" : "crosshair";
    this.eraserEl.classList.toggle("active");
    this.bruesEl.classList.remove("active");
  }
}

new DrawingBoard();
