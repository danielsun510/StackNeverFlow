/*
 * This class is used for ranking answers based on various parameters
 */
package edu.pitt.sis.is2140.core;

import edu.pitt.sis.is2140.viewModel.Answer;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

/**
 *
 * @author Wu
 */
public class AnswerRanking {

    /**
     * Sort answer list based on different parameters
     *
     * @param input
     */
    public static void ranking(List<Answer> input) {
        Collections.sort(input, new Comparator<Answer>() {

            @Override
            public int compare(Answer o1, Answer o2) {
                throw new UnsupportedOperationException("Not supported yet.");
            }

        });
    }
}
