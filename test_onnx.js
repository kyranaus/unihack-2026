import * as ort from 'onnxruntime-node';
async function test() {
  try {
    const session = await ort.InferenceSession.create('./public/models/yolov8n.onnx');
    console.log('Model is valid! Input names:', session.inputNames, 'Output names:', session.outputNames);
  } catch (e) {
    console.error('Model load failed:', e);
  }
}
test();
