import { getCustomRepository } from 'typeorm';
import AppError from '../../../shared/errors/AppError';
import Product from '../typeorm/entities/Product';
import { ProductRepository } from '../typeorm/repositories/ProductsRepository';

interface IRequest {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

class UpdateProductService {
  public async execute({
    id,
    name,
    price,
    quantity,
  }: IRequest): Promise<Product> {
    const productsRepository = getCustomRepository(ProductRepository);

    const product = await productsRepository.findOne(id);

    if (!product) {
      throw new AppError('Produto informado não existe no banco de dados.');
    }

    const productExists = await productsRepository.findByName(name);

    if (productExists && name !== product.name) {
      throw new AppError(
        `Já existe outro produto cadastrado com o este nome : ${name}`,
      );
    }

    name ? (product.name = name) : product.name;
    price ? (product.price = price) : product.price;
    quantity ? (product.quantity = quantity) : product.quantity;

    await productsRepository.save(product);

    return product;
  }
}

export default UpdateProductService;
