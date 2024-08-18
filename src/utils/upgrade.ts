// IO串行处理
const handleOutputFn = (
  relOutputs: { [x: string]: any },
  outputs: { [x: string]: any },
  OutputId: string,
  val: any
) => {
  const outputFn = relOutputs?.[OutputId] || outputs[OutputId];
  if (outputFn) {
    outputFn(val);
  }
};

export { handleOutputFn };
