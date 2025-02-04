<?php

declare(strict_types=1);

/*
 * This file is part of the TYPO3 CMS project.
 *
 * It is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License, either version 2
 * of the License, or any later version.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 *
 * The TYPO3 project - inspiring people to share!
 */

namespace TYPO3\CMS\Belog\ViewHelpers;

use TYPO3\CMS\Belog\Domain\Model\LogEntry;
use TYPO3\CMS\Core\Utility\PathUtility;
use TYPO3Fluid\Fluid\Core\Rendering\RenderingContextInterface;
use TYPO3Fluid\Fluid\Core\ViewHelper\AbstractViewHelper;
use TYPO3Fluid\Fluid\Core\ViewHelper\Traits\CompileWithRenderStatic;

/**
 * Create detail string from log entry
 *
 * @internal
 */
final class FormatDetailsViewHelper extends AbstractViewHelper
{
    use CompileWithRenderStatic;

    public function initializeArguments(): void
    {
        $this->registerArgument('logEntry', LogEntry::class, '', true);
    }

    /**
     * Create formatted detail string from log row.
     *
     * The method handles two properties of the model: details and logData
     * Details is a string with possible %s placeholders, and logData an array
     * with the substitutions.
     * Furthermore, possible files in logData are stripped to their basename if
     * the action logged was a file action
     */
    public static function renderStatic(array $arguments, \Closure $renderChildrenClosure, RenderingContextInterface $renderingContext): string
    {
        /** @var LogEntry $logEntry */
        $logEntry = $arguments['logEntry'];
        $detailString = $logEntry->getDetails();
        $substitutes = $logEntry->getLogData();
        // Strip paths from file names if the log was a file action
        if ($logEntry->getType() === 2) {
            $substitutes = self::stripPathFromFilenames($substitutes);
        }
        // Substitute
        if (!empty($substitutes)) {
            $detailString = vsprintf($detailString, $substitutes);
        }
        // Remove possible pending other %s
        return str_replace('%s', '', $detailString);
    }

    /**
     * Strips path from array of file names
     */
    protected static function stripPathFromFilenames(array $files = []): array
    {
        foreach ($files as $key => $file) {
            $files[$key] = PathUtility::basename($file);
        }
        return $files;
    }
}
