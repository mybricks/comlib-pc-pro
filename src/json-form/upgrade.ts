import { Data } from './runtime'

export default function ({ data, input, output }: UpgradeParams<Data>): boolean {
  /**
   * v1.0.0 -> v1.0.1 控制操作按钮的显示隐藏
   */
  if (data?.submitter === undefined) {
    data.submitter = true;
  }

  return true;
}
