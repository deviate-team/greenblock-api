import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';
import { CreateTransactionDTO } from './dto/create-transactions.dto';
@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
  ) {}

  async create(createTransactionDto: CreateTransactionDTO) {
    await this.transactionModel.create(createTransactionDto);
  }

  async findAll() {
    const transactions = await this.transactionModel
      .find()
      .populate(
        'user',
        '-__v -password -createdAt -updatedAt -role -birthDate -firstName -lastName',
      )
      .select('-__v')
      .sort({ createdAt: -1 })
      .exec();

    return transactions;
  }

  async findAllWithPagination(page = '1', limit = '10', user) {
    const parsedPage = Math.max(Number(page), 1);
    const parsedLimit = Number(limit);

    const count = await this.transactionModel.countDocuments().exec();
    const transactions = await this.transactionModel
      .find({
        user: user._id,
      })
      .limit(parsedLimit)
      .skip((parsedPage - 1) * parsedLimit)
      .populate(
        'user',
        '-__v -password -createdAt -updatedAt -role -birthDate -firstName -lastName',
      )
      .populate(
        'ticket',
        '-__v -createdAt -updatedAt -seat_booked -seat_limit -provider',
      )
      .select('-__v')
      .sort({ createdAt: -1 })
      .exec();

    return {
      totalTransactions: count,
      currentPage: parsedPage,
      totalPages: Math.ceil(count / parsedLimit),
      transactions,
    };
  }

  async findOne(id: string) {
    const transaction = await this.transactionModel
      .findById(id)
      .populate(
        'user',
        '-__v -password -createdAt -updatedAt -role -birthDate -firstName -lastName',
      )
      .populate(
        'ticket',
        '-__v -createdAt -updatedAt -seat_booked -seat_limit -provider',
      )
      .select('-__v')
      .exec();

    return transaction;
  }
}
