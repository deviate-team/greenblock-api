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
    try {
      await this.transactionModel.create(createTransactionDto);
    } catch (error) {
      console.log(error);
    }
  }

  async findAll() {
    try {
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
    } catch (error) {
      console.log(error);
    }
  }

  async findAllWithPagination(page = '1', limit = '10', user) {
    try {
      const parsedPage = Math.max(Number(page), 1);
      const parsedLimit = Number(limit);

      const count = await this.transactionModel
        .countDocuments({
          user: user._id,
        })
        .exec();
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
    } catch (error) {
      console.log(error);
    }
  }

  async findOne(id: string) {
    try {
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
    } catch (error) {
      console.log(error);
    }
  }
}
