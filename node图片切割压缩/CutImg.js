const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');
const JPEG = require('jpeg-js');
Jimp.decoders['image/jpeg'] = (data) => JPEG.decode(data, {
  maxMemoryUsageInMB: 6144,
  maxResolutionInMP: 600
});


// 设置输出小图的根路径（保存到上一级目录的 MapImg 文件夹中）
const outputRootPath = path.join(__dirname, '..', 'MapImg');
const miniImg_5_Path = path.join(__dirname, '..', 'MapMiniImg');

// 确保输出根路径存在
if (!fs.existsSync(outputRootPath)) {
  fs.mkdirSync(outputRootPath);
}

//获取参数
let fileName = process.argv[2];
//获取同级目录下指定文件名的文件
let filePath = fileName ? [fileName + ".jpg"] : fs.readdirSync(__dirname);

// 循环处理同级目录下的 jpg 图片
filePath.forEach(async file => {
  //判断文件是否存在
  if (!fs.existsSync(path.join(__dirname, file))) {
    console.log("文件不存在");
    return;
  }
  if (path.extname(file) === '.jpg') {
    let currentIndex = 1;
    const filename = path.parse(file).name;

    // 使用 jimp 库分割和压缩图片
    const image = await Jimp.read(file);


    // 创建大图对应的文件夹
    const outputFolderPath = path.join(outputRootPath, filename);
    if (!fs.existsSync(outputFolderPath)) {
      fs.mkdirSync(outputFolderPath);
    }

    for (let y = 0; y < image.bitmap.height; y += 512) {
      const croppedHeight = Math.min(512, image.bitmap.height - y);

      for (let x = 0; x < image.bitmap.width; x += 512) {
        const croppedWidth = Math.min(512, image.bitmap.width - x);

        const smallImage = image.clone().crop(x, y, croppedWidth, croppedHeight);

        // 压缩图像，quality 为压缩质量（0-100）
        const outputFilename = `${filename}_${currentIndex}.jpg`;
        const outputPath = path.join(outputFolderPath, outputFilename);
        smallImage.quality(100).writeAsync(outputPath); // 调整 quality 的值来设置压缩质量
        console.log(`小图已生成: ${outputPath}`);
        currentIndex++;
      }
    }

    //使用 jimp 压缩图片
    await image.quality(10).writeAsync(file);
    console.log("大图压缩成功：" + filename);
    //导出一张比例为5%的图片
    let miniImgName = path.parse(file).name + ".jpg";
    let miniPath = path.join(miniImg_5_Path, miniImgName);
    await image.scale(0.05).writeAsync(miniPath);
    console.log("导出一张比例为5%的图片：" + filename);

  }
});