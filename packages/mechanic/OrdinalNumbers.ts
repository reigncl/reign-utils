import { Ordinals, ordinalNames } from "./Ordinals";
import { Path } from "./Path";

const MAX_NUM_LENGTH = ordinalNames.size;

export interface OrdinalOptions {
  style: string,
  noun?: string,
}

export class OrdinalNumbers {
  private style: string;
  private noun: string;
  private spacePath: Path;
  
  constructor(options: OrdinalOptions){
    this.style = options.style || 'long';
    this.noun = options.noun || 'm';
    this.spacePath = {type: 'space', value: ' '}
  }

  private changeNoun(strNumber: string): string{
    return `${strNumber.slice(0, -1)}a`
  }

  private toShort(pathNumber: Path, nums: string): Path[]{
    const suffix = pathNumber.value.slice(-2)
    return [{type: 'amount', value: nums }, { type: 'suffix', value: suffix }]
  }

  private toOrdinal(strNumber: string): string[] {
    const numArr = strNumber.split('').reverse()
    const ordinalArr: string[] = []
    numArr.forEach((num, index) => {
      const ordinalNum = Ordinals[index].get(num)
      if(ordinalNum) ordinalArr.push(ordinalNum)
    });
    return ordinalArr.reverse();
  }

  formatToParts(nums: string): Path[] {
    
    const ordinalArr: Path[] = []

    if(nums.length > MAX_NUM_LENGTH) throw new Error(`Number too long, try between 0 and ${MAX_NUM_LENGTH}`)

    let maxIndex = nums.length - 1;

    this.toOrdinal(nums).forEach((num, index) => {
      const numberNoun = this.noun === 'm' ? num : this.changeNoun(num);
      const type = ordinalNames.get(maxIndex.toString());
      maxIndex--
      if(type) ordinalArr.push({ type: type, value: numberNoun })
      if(index < nums.length - 1) ordinalArr.push(this.spacePath)
    })
    
    if(this.style === 'short') {
      return this.toShort(ordinalArr[ordinalArr.length-1], nums)
    }
    
    return ordinalArr
  }
  
  format(num: string): string{
    return this.formatToParts(num).map(part => part.value).join('');
  }
}
