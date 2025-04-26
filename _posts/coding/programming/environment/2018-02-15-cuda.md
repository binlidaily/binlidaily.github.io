---
layout: post
title: "CUDA编程的一些记录"
author: "Bin Li"
tags: [CUDA, Programming]
category: ""
comments: true
published: false
---

## Fix bug

### cuda error 11 invalid argument

这个问题一般是参数没有对应上，之前我cudaMemcpyHostToDevice这个没有对应上，注意代码是要从Host拷贝到Device还是相反的。

```c++
checkCudaErrors(cudaMemcpy(pnDevLabelSubset, pnLabelAll, sizeof(int) * pnSizeofParts[0], cudaMemcpyHostToDevice));
```




## 矩阵操作

### 矩阵乘法


### 矩阵转置

```C++
// https://devblogs.nvidia.com/parallelforall/efficient-matrix-transpose-cuda-cc/
__global__ void transposeNaive(float *odata, const float *idata)
{
  int x = blockIdx.x * TILE_DIM + threadIdx.x;
  int y = blockIdx.y * TILE_DIM + threadIdx.y;
  int width = gridDim.x * TILE_DIM;

  for (int j = 0; j < TILE_DIM; j+= BLOCK_ROWS)
    odata[x*width + (y+j)] = idata[(y+j)*width + x];
}

__global__ void transposeCoalesced(float *odata, const float *idata)
{
  __shared__ float tile[TILE_DIM][TILE_DIM];

  int x = blockIdx.x * TILE_DIM + threadIdx.x;
  int y = blockIdx.y * TILE_DIM + threadIdx.y;
  int width = gridDim.x * TILE_DIM;

  for (int j = 0; j < TILE_DIM; j += BLOCK_ROWS)
     tile[threadIdx.y+j][threadIdx.x] = idata[(y+j)*width + x];

  __syncthreads();

  x = blockIdx.y * TILE_DIM + threadIdx.x;  // transpose block offset
  y = blockIdx.x * TILE_DIM + threadIdx.y;

  for (int j = 0; j < TILE_DIM; j += BLOCK_ROWS)
     odata[(y+j)*width + x] = tile[threadIdx.x][threadIdx.y + j];
}

__global__ void copySharedMem(float *odata, const float *idata)
{
  __shared__ float tile[TILE_DIM * TILE_DIM];

  int x = blockIdx.x * TILE_DIM + threadIdx.x;
  int y = blockIdx.y * TILE_DIM + threadIdx.y;
  int width = gridDim.x * TILE_DIM;

  for (int j = 0; j < TILE_DIM; j += BLOCK_ROWS)
     tile[(threadIdx.y+j)*TILE_DIM + threadIdx.x] = idata[(y+j)*width + x];

  __syncthreads();

  for (int j = 0; j < TILE_DIM; j += BLOCK_ROWS)
     odata[(y+j)*width + x] = tile[(threadIdx.y+j)*TILE_DIM + threadIdx.x];          
}
```

也可以用`cublas`的`API`来计算：`cublasSgeam`，row-major matrix A[m][n。
```
float* clone = ...;//copy content of A to clone
    float const alpha(1.0);
    float const beta(0.0);
    cublasHandle_t handle;
    cublasCreate(&handle);
    cublasSgeam( handle, CUBLAS_OP_T, CUBLAS_OP_N, m, n, &alpha, clone, n, &beta, clone, m, A, m );
    cublasDestroy(handle);
```

### 输出
```
#include <thrust\device_vector.h>

void main() {

    const int N = 10;

    int *h_data = (int*)malloc(N*sizeof(int));
    for (int i=0; i<N; i++) h_data[i] = 3;

    int *d_data; cudaMalloc(&d_data, N*sizeof(int));    

    cudaMemcpy(d_data,h_data,N*sizeof(int),cudaMemcpyHostToDevice);

    // --- Alternative approach
    thrust::device_ptr<int> dev_ptr_key     = thrust::device_pointer_cast(d_data);
    int i = 4; printf("Element number %d is equal to %d\n",i,(int)*(dev_ptr_key+i));

    getchar();

}
```

### 矩阵求逆

```c++
$ cat t605.cu
#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <cuda_runtime.h>
#include <cublas_v2.h>

#define PERR(call) \
  if (call) {\
   fprintf(stderr, "%s:%d Error [%s] on "#call"\n", __FILE__, __LINE__,\
      cudaGetErrorString(cudaGetLastError()));\
   exit(1);\
  }
#define ERRCHECK \
  if (cudaPeekAtLastError()) { \
    fprintf(stderr, "%s:%d Error [%s]\n", __FILE__, __LINE__,\
       cudaGetErrorString(cudaGetLastError()));\
    exit(1);\
  }

__global__ void
inv_kernel(float *a_i, float *c_o, int n)
{
  int *p = (int *)malloc(3*sizeof(int));
  int *info = (int *)malloc(sizeof(int));
  int batch;
  cublasHandle_t hdl;
  cublasStatus_t status = cublasCreate_v2(&hdl);
  printf("handle %d n = %d\n", status, n);

  info[0] = 0;
  batch = 1;
  float **a = (float **)malloc(sizeof(float *));
  *a = a_i;
  const float **aconst = (const float **)a;
  float **c = (float **)malloc(sizeof(float *));
  *c = c_o;
  // See
  // http://docs.nvidia.com/cuda/pdf/CUDA_Dynamic_Parallelism_Programming_Guide.pdf
  //http://stackoverflow.com/questions/27094612/cublas-matrix-inversion-from-device
  status = cublasSgetrfBatched(hdl, n, a, n, p, info, batch);
  __syncthreads();
  printf("rf %d info %d\n", status, info[0]);
  status = cublasSgetriBatched(hdl, n, aconst, n, p,
      c, n, info, batch);
  __syncthreads();
  printf("ri %d info %d\n", status, info[0]);
  cublasDestroy_v2(hdl);
  printf("done\n");
}
static void
run_inv(float *in, float *out, int n)
{
  float *a_d, *c_d;

  PERR(cudaMalloc(&a_d, n*n*sizeof(float)));
  PERR(cudaMalloc(&c_d, n*n*sizeof(float)));
  PERR(cudaMemcpy(a_d, in, n*n*sizeof(float), cudaMemcpyHostToDevice));

  inv_kernel<<<1, 1>>>(a_d, c_d, n);

  cudaDeviceSynchronize();
  ERRCHECK;

  PERR(cudaMemcpy(out, c_d, n*n*sizeof(float), cudaMemcpyDeviceToHost));
  PERR(cudaFree(a_d));
  PERR(cudaFree(c_d));
}

int
main(int argc, char **argv)
{
  float c[9];
  float a[] = {
    1,   2,   3,
    0,   4,   5,
    1,   0,   6 };

  run_inv(a, c, 3);
  for (int i = 0; i < 3; i++){
    for (int j = 0; j < 3; j++) printf("%f, ",c[(3*i)+j]);
    printf("\n");}

  return 0;
}
$ nvcc -arch=sm_35 -rdc=true -o t605 t605.cu -lcublas_device -lcudadevrt
nvlink warning : SM Arch ('sm_35') not found in '/shared/apps/cuda/CUDA-v6.5.14/bin/..//lib64/libcublas_device.a:maxwell_sgemm.asm.o'
nvlink warning : SM Arch ('sm_35') not found in '/shared/apps/cuda/CUDA-v6.5.14/bin/..//lib64/libcublas_device.a:maxwell_sm50_sgemm.o'
$ ./t605
handle 0 n = 3
rf 0 info 0
ri 0 info 0
done
1.090909, -0.545455, -0.090909,
0.227273, 0.136364, -0.227273,
-0.181818, 0.090909, 0.181818,
$
```





